import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuyerProfile } from 'src/buyers/buyer-profile.entity';
import { SellerProfile } from 'src/sellers/seller-profile.entity';
import { AdminProfile } from 'src/admin/admin-profile.entity';
import { MailerService } from 'src/mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { Role } from 'src/common/enums/role.enum';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(BuyerProfile)
        private buyerProfileRepo: Repository<BuyerProfile>,
        @InjectRepository(SellerProfile)
        private sellerProfileRepo: Repository<SellerProfile>,
        @InjectRepository(AdminProfile)
        private adminProfileRepo: Repository<AdminProfile>,
    ) { }

    // Store only a hash of the refresh token to support rotation and revoke.
    private async buildTokens(user: User) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        await this.userRepo.update({ id: user.id }, { refreshTokenHash });

        return { accessToken, refreshToken };
    }

    private buildPasswordResetToken() {
        const token = crypto.randomBytes(32).toString('hex');
        const hash = crypto.createHash('sha256').update(token).digest('hex');
        return { token, hash };
    }

    async login(email: string, password: string) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.userRepo.findOne({ where: { email: normalizedEmail } });
        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        if (!user.isActive) {
            throw new HttpException('Account is inactive', HttpStatus.FORBIDDEN);
        }

    const match = await bcrypt.compare(password, user.passwordHash || '');
    if (!match) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (user.role === Role.SELLER) {
        const sellerProfile = await this.sellerProfileRepo.findOne({
            where: { user: { id: user.id } },
        });
        if (!sellerProfile) {
            throw new HttpException('Seller profile not found', HttpStatus.FORBIDDEN);
        }
        if (sellerProfile.status !== 'APPROVED') {
            throw new HttpException('Seller account is not approved', HttpStatus.FORBIDDEN);
        }
    }

        const tokens = await this.buildTokens(user);
        return { access_token: tokens.accessToken, refresh_token: tokens.refreshToken };
    }

    async register(dto: RegisterDto) {
        const normalizedEmail = dto.email.trim().toLowerCase();
        const existing = await this.userRepo.findOne({ where: { email: normalizedEmail } });
        if (existing) {
            throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
        }

        if (dto.role === Role.ADMIN && process.env.ALLOW_ADMIN_SIGNUP !== 'true') {
            throw new HttpException('Admin signup is disabled', HttpStatus.FORBIDDEN);
        }

        if (dto.role === Role.BUYER && !dto.buyerProfile) {
            throw new HttpException('Buyer profile is required', HttpStatus.BAD_REQUEST);
        }
        if (dto.role === Role.SELLER && !dto.sellerProfile) {
            throw new HttpException('Seller profile is required', HttpStatus.BAD_REQUEST);
        }
        if (dto.role === Role.ADMIN && !dto.adminProfile) {
            throw new HttpException('Admin profile is required', HttpStatus.BAD_REQUEST);
        }

        const buyerProfileInput = dto.buyerProfile;
        const sellerProfileInput = dto.sellerProfile;
        const adminProfileInput = dto.adminProfile;

        const result = await this.userRepo.manager.transaction(async (manager) => {
            const hashed = await bcrypt.hash(dto.password, 10);
            const userRepo = manager.getRepository(User);
            const buyerRepo = manager.getRepository(BuyerProfile);
            const sellerRepo = manager.getRepository(SellerProfile);
            const adminRepo = manager.getRepository(AdminProfile);

            const user = userRepo.create({
                email: normalizedEmail,
                passwordHash: hashed,
                role: dto.role,
                isActive: dto.role !== Role.SELLER,
            });
            const savedUser = await userRepo.save(user);

            if (dto.role === Role.BUYER) {
                const profile = buyerRepo.create({
                    user: savedUser,
                    fullName: buyerProfileInput!.fullName,
                    phone: buyerProfileInput!.phone,
                    age: buyerProfileInput!.age,
                    status: buyerProfileInput!.status ?? 'active',
                    defaultAddressId: buyerProfileInput!.defaultAddressId,
                });
                const savedProfile = await buyerRepo.save(profile);
                return { user: savedUser, profile: savedProfile, role: Role.BUYER };
            }

            if (dto.role === Role.SELLER) {
                const profile = sellerRepo.create({
                    user: savedUser,
                    storeName: sellerProfileInput!.storeName,
                    phone: sellerProfileInput!.phone,
                    status: 'PENDING',
                });
                const savedProfile = await sellerRepo.save(profile);
                return { user: savedUser, profile: savedProfile, role: Role.SELLER };
            }

            if (dto.role === Role.ADMIN) {
                const profile = adminRepo.create({
                    user: savedUser,
                    displayName: adminProfileInput!.displayName,
                    profileName: adminProfileInput!.profileName,
                });
                const savedProfile = await adminRepo.save(profile);
                return { user: savedUser, profile: savedProfile, role: Role.ADMIN };
            }

            throw new HttpException('Unsupported role', HttpStatus.BAD_REQUEST);
        });

        if (result.role === Role.BUYER) {
            const profile = result.profile as BuyerProfile;
            await this.mailerService.sendBuyerWelcomeEmail(result.user.email, profile.fullName);
            return { message: 'Buyer registered', userId: result.user.id, profileId: profile.id };
        }
        if (result.role === Role.SELLER) {
            const profile = result.profile as SellerProfile;
            await this.mailerService.sendSellerApplicationReceivedEmail(result.user.email, profile.storeName);
            return { message: 'Seller registered', userId: result.user.id, profileId: profile.id };
        }
        if (result.role === Role.ADMIN) {
            const profile = result.profile as AdminProfile;
            await this.mailerService.sendAdminWelcomeEmail(result.user.email, profile.displayName);
            return { message: 'Admin registered', userId: result.user.id, profileId: profile.id };
        }

        throw new HttpException('Unsupported role', HttpStatus.BAD_REQUEST);
    }

    async refreshToken(userId: string, refreshToken: string) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user || !user.refreshTokenHash) {
            throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
        }
        if (!user.isActive) {
            throw new HttpException('Account is inactive', HttpStatus.FORBIDDEN);
        }

        const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!match) {
            throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
        }

        const tokens = await this.buildTokens(user);
        return { access_token: tokens.accessToken, refresh_token: tokens.refreshToken };
    }

    async logout(userId: string) {
        await this.userRepo.update({ id: userId }, { refreshTokenHash: null });
        return { message: 'Logged out' };
    }

    async requestPasswordReset(dto: ForgotPasswordDto) {
        const normalizedEmail = dto.email.trim().toLowerCase();
        const user = await this.userRepo.findOne({ where: { email: normalizedEmail } });

        if (user && user.isActive) {
            const { token, hash } = this.buildPasswordResetToken();
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

            await this.userRepo.update(
                { id: user.id },
                {
                    passwordResetTokenHash: hash,
                    passwordResetExpiresAt: expiresAt,
                },
            );

            const appUrl = process.env.APP_URL || 'http://localhost:3000';
            const resetLink = `${appUrl}/reset-password?token=${token}`;
            await this.mailerService.sendPasswordResetEmail(user.email, resetLink);
        }

        return { message: 'If that email exists, a reset link has been sent.' };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');
        const user = await this.userRepo.findOne({ where: { passwordResetTokenHash: tokenHash } });

        if (!user || !user.passwordResetExpiresAt) {
            throw new HttpException('Invalid or expired reset token', HttpStatus.BAD_REQUEST);
        }
        if (user.passwordResetExpiresAt.getTime() < Date.now()) {
            throw new HttpException('Reset token has expired', HttpStatus.BAD_REQUEST);
        }
        if (!user.isActive) {
            throw new HttpException('Account is inactive', HttpStatus.FORBIDDEN);
        }

        const hashed = await bcrypt.hash(dto.password, 10);
        await this.userRepo.update(
            { id: user.id },
            {
                passwordHash: hashed,
                passwordResetTokenHash: null,
                passwordResetExpiresAt: null,
                refreshTokenHash: null,
            },
        );

        return { message: 'Password has been reset successfully.' };
    }
}
