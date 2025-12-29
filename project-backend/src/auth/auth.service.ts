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

    async login(email: string, password: string) {
        const user = await this.userRepo.findOne({ where: { email } });
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

        const tokens = await this.buildTokens(user);
        return { access_token: tokens.accessToken, refresh_token: tokens.refreshToken };
    }

    async register(dto: RegisterDto) {
        const existing = await this.userRepo.findOne({ where: { email: dto.email } });
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

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            email: dto.email,
            passwordHash: hashed,
            role: dto.role,
            isActive: true,
        });
        const savedUser = await this.userRepo.save(user);

        if (dto.role === Role.BUYER) {
            const profile = this.buyerProfileRepo.create({
                user: savedUser,
                fullName: dto.buyerProfile.fullName,
                phone: dto.buyerProfile.phone,
                age: dto.buyerProfile.age,
                status: dto.buyerProfile.status ?? 'active',
                defaultAddressId: dto.buyerProfile.defaultAddressId,
            });
            const savedProfile = await this.buyerProfileRepo.save(profile);
            await this.mailerService.sendBuyerWelcomeEmail(savedUser.email, savedProfile.fullName);
            return { message: 'Buyer registered', userId: savedUser.id, profileId: savedProfile.id };
        }

        if (dto.role === Role.SELLER) {
            const profile = this.sellerProfileRepo.create({
                user: savedUser,
                storeName: dto.sellerProfile.storeName,
                phone: dto.sellerProfile.phone,
                status: dto.sellerProfile.status ?? 'PENDING',
            });
            const savedProfile = await this.sellerProfileRepo.save(profile);
            await this.mailerService.sendSellerApplicationReceivedEmail(savedUser.email, savedProfile.storeName);
            return { message: 'Seller registered', userId: savedUser.id, profileId: savedProfile.id };
        }

        if (dto.role === Role.ADMIN) {
            const profile = this.adminProfileRepo.create({
                user: savedUser,
                displayName: dto.adminProfile.displayName,
                profileName: dto.adminProfile.profileName,
            });
            const savedProfile = await this.adminProfileRepo.save(profile);
            await this.mailerService.sendAdminWelcomeEmail(
                savedUser.email,
                savedProfile.displayName,
            );
            return { message: 'Admin registered', userId: savedUser.id, profileId: savedProfile.id };
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
}
