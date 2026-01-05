import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuyerProfile } from 'src/buyer/entities/buyer-profile.entity';
import { CreateBuyerDto } from 'src/buyer/dto/buyerProfileDtos/create-buyer.dto';
import { Seller } from 'src/seller/entities/seller.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { MailerService } from 'src/mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import { profile } from 'console';
import { Profile } from 'passport';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { CreateSellerDto } from 'src/seller/dto/create-seller.dto';
import { IsPhoneNumber } from 'class-validator';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        @InjectRepository(BuyerProfile)
        private buyerRepo: Repository<BuyerProfile>,
        @InjectRepository(Seller)
        private sellerRepo: Repository<Seller>,
        @InjectRepository(Admin)
        private adminRepo: Repository<Admin>,
    ) { }

    private async validateBuyer(email: string, password: string) {
        const user = await this.buyerRepo.findOne({ where: { email } });
        if (!user) return null;
        const match = await bcrypt.compare(password, user.password || '');
        if (!match) return null;
        return { id: user.buyerId, email: user.email, role: 'buyer' };
    }

    private async validateSeller(email: string, password: string) {
        const user = await this.sellerRepo.findOne({ where: { email } });
        if (!user) return null;
        const match = await bcrypt.compare(password, user.password || '');
        if (!match) return null;
        return { id: user.id, email: user.email, role: 'seller' };
    }

    private async validateAdmin(email: string, password: string) {
        const user = await this.adminRepo.findOne({ where: { email } });
        if (!user) return null;
        const match = await bcrypt.compare(password, (user as any).password || '');
        if (!match) return null;
        return { id: user.id, email: user.email, role: 'admin' };
    }

    async login(email: string, password: string) {
        // Try buyer, seller, admin in that order (simple approach)
        const validators = [
            this.validateBuyer.bind(this),
            this.validateSeller.bind(this),
            this.validateAdmin.bind(this),
        ];

        for (const validate of validators) {
            const user = await validate(email, password);
            if (user) {
                const payload = { sub: user.id, email: user.email, role: user.role };
                return { access_token: this.jwtService.sign(payload), role: user.role };
            }
        }

        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    async registerBuyer(dto: CreateBuyerDto) {
        const existing = await this.buyerRepo.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
        }

        const saltRounds = 10;
        const hashed = await bcrypt.hash(dto.password, saltRounds);

        const toSave = this.buyerRepo.create({
            name: dto.name,
            email: dto.email,
            password: hashed,
            phone: dto.phone,
            age: dto.age,
            status: dto.status,
            defaultAddressId: dto.defaultAddressId,
        } as any);

        const saved = (await this.buyerRepo.save(toSave)) as unknown as BuyerProfile;
        
        // Send welcome email
        await this.mailerService.sendWelcomeEmail(saved.email, saved.name);
        
        return { message: 'Buyer registered', buyerId: saved.buyerId, email: saved.email };
    }

    async registerAdmin(dto: CreateAdminDto) {
        const existing = await this.adminRepo.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
        }
        const saltRounds = 10;
        const hashed = await bcrypt.hash(dto.password, saltRounds);
        const toSave = this.adminRepo.create({
            email: dto.email,
            password: hashed,
            name: dto.name,
            phone: dto.phone,
            nid: dto.nid,
            role: dto.role,
            profileName: dto.profileName,
            isActive: dto.isActive,
        } as any);
        const saved = (await this.adminRepo.save(toSave)) as unknown as Admin;
        
        // Send admin credentials email
        await this.mailerService.sendAdminCredentialsEmail(saved.email, saved.name, saved.id, dto.password);
        
        return { message: 'Admin registered', adminId: saved.id, email: saved.email };
    }

    async registerSeller(dto: CreateSellerDto) {
        const existing = await this.sellerRepo.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
        }
        const saltRounds = 10;
        const hashed = await bcrypt.hash(dto.password, saltRounds);
        const toSave = this.sellerRepo.create({
            email: dto.email,
            password: hashed,
            username: dto.username,
            fullName: dto.fullName,
            phoneNumber: dto.phoneNumber,
            isActive: dto.isActive,
            gender: dto.gender,
        } as any);
        const saved = (await this.sellerRepo.save(toSave)) as unknown as Seller;
        
        // Send seller activation email
        await this.mailerService.sendSellerActivationEmail(saved.email, saved.fullName);
        
        return { message: 'Seller registered', sellerId: saved.id, email: saved.email };
    }
}
