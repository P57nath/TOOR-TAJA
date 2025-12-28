import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminProfile } from './entities/admin-profile.entity';
import { CreateAdminProfileDto } from './dto/create-admin-profile.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminProfileService {
  constructor(
    @InjectRepository(AdminProfile)
    private profileRepo: Repository<AdminProfile>,

    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) {}

  async createProfile(adminId: string, dto: CreateAdminProfileDto) {
    const admin = await this.adminRepo.findOne({
      where: { id: adminId },
      relations: ['profile'],
    });

    if (!admin) throw new NotFoundException('Admin not found');

    const profile = this.profileRepo.create({
      ...dto,
      admin,
    });

    return this.profileRepo.save(profile);
  }

  async getProfile(adminId: string) {
    const profile = await this.profileRepo.findOne({
      where: { admin: { id: adminId } },
      relations: ['admin'],
    });

    if (!profile) throw new NotFoundException('Profile not found');

    return profile;
  }
}
