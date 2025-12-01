import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository,IsNull, And, Not } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuditQueryDto, PageQueryDto } from './dto/query.dto';
import { Admin } from './entities/admin.entity';
import { Role } from './enums/role';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { GetNullNamesDto } from './dto/getNullNames.dto';
import { BuyerProfile } from 'src/buyer/entities/buyer-profile.entity';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(BuyerProfile)
    private buyerRepository: Repository<any>,
  ) { }

  private audits: any[] = [];

  private ok(data: any, extra: Record<string, any> = {}) {
    return { success: true, ...extra, data };
  }

  // // Create a user
  // async create(dto: CreateAdminDto) {
  //   const admin = this.adminRepository.create({
  //     email: dto.email,
  //     name: dto.name,
  //     nid: dto.nid.trim(),
  //     phone: dto.phone,
  //     role: dto.role,
  //     profileName: dto.profileName ?? '',
  //     isActive: true,
  //   });

  //   const savedAdmin = await this.adminRepository.save(admin);

  //   this.audits.push({
  //     id: 'log_' + Date.now(),
  //     type: 'create',
  //     adminId: savedAdmin.id,
  //     at: new Date()
  //   });

  //   return this.ok(savedAdmin, { message: 'Admin created' });
  // }

//   async findAll() {
//   const admins = await this.adminRepository.find();
//   return this.ok(admins);
// }
//  async findActive(q: PageQueryDto, isActive: string) {
//   const page = Number(q.page) || 1;
//   const limit = Number(q.limit) || 20;
//   const skip = (page - 1) * limit;

//   const [admins, total] = await this.adminRepository.findAndCount({
//     where: {
//       isActive: isActive === 'true' ? true : false,
//     },
   
//     skip,
//     take: limit,
//     order: { createdAt: 'DESC' },
//   });

//   return this.ok(admins, {
//     page,
//     limit,
//     total,
//     message: `Admins retrieved successfully`,
//   });
// }



  async findOne(id: string) {
    const item = await this.adminRepository.findOne({ where: { id } });
    return this.ok(item ?? null);
  }
  


  

  // async replace(id: string, dto: CreateAdminDto) {
  //   const existingAdmin = await this.adminRepository.findOne({ where: { id } });
  //   const now = new Date();

  //   if (existingAdmin) {
  //     Object.assign(existingAdmin, {
  //       email: dto.email,
  //       name: dto.name,
  //       nid: dto.nid,
  //       phone: dto.phone,
  //       role: dto.role,
  //       profileName: dto.profileName ?? existingAdmin.profileName,
  //       updatedAt: now,
  //     });

  //     const updatedAdmin = await this.adminRepository.save(existingAdmin);
  //     this.audits.push({
  //       id: 'log_' + Date.now(),
  //       type: 'replace',
  //       adminId: id,
  //       at: now
  //     });

  //     return this.ok(updatedAdmin, { message: 'Admin replaced' });
  //   } else {
  //     const newAdmin = this.adminRepository.create({
  //       id,
  //       email: dto.email,
  //       name: dto.name,
  //       nid: dto.nid,
  //       phone: dto.phone,
  //       role: dto.role,
  //       profileName: dto.profileName ?? '',
  //       isActive: true,
  //     });

  //     const savedAdmin = await this.adminRepository.save(newAdmin);
  //     this.audits.push({
  //       id: 'log_' + Date.now(),
  //       type: 'replace',
  //       adminId: id,
  //       at: now
  //     });

  //     return this.ok(savedAdmin, { message: 'Admin replaced' });
  //   }
  // }

  async update(id: string, dto: UpdateAdminDto) {
    const item = await this.adminRepository.findOne({ where: { id } });
    if (!item) return this.ok(null, { message: 'Not found' });

    const patch = { ...dto };
    if (Object.prototype.hasOwnProperty.call(dto, 'profileName')) {
      patch.profileName = dto.profileName ?? item.profileName;
    }

    Object.assign(item, patch, { updatedAt: new Date() });
    const updatedAdmin = await this.adminRepository.save(item);

    this.audits.push({
      id: 'log_' + Date.now(),
      type: 'update',
      adminId: id,
      at: new Date()
    });

    return this.ok(updatedAdmin, { message: 'Admin updated' });
  }

  // Remove a user from the system based on their id
  async remove(id: string) {
    const result = await this.adminRepository.delete(id);
    this.audits.push({
      id: 'log_' + Date.now(),
      type: 'delete',
      adminId: id,
      at: new Date()
    });

    return this.ok(
      { removed: result.affected },
      { message: 'Admin deleted' }
    );
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    const item = await this.adminRepository.findOne({ where: { id } });
    if (!item) return this.ok(null, { message: 'Not found' });

    item.role = dto.role;
    item.updatedAt = new Date();

    const updatedAdmin = await this.adminRepository.save(item);

    this.audits.push({
      id: 'log_' + Date.now(),
      type: 'role-change',
      adminId: id,
      detail: dto.reason,
      at: new Date(),
    });

    return this.ok(updatedAdmin, { message: 'Role updated' });
  }

  getAuditLogs(q: AuditQueryDto) {
    let res = [...this.audits];
    if (q.type) res = res.filter(l => l.type === q.type);
    if (q.from) res = res.filter(l => new Date(l.at) >= new Date(q.from!));
    if (q.to) res = res.filter(l => new Date(l.at) <= new Date(q.to!));
    return this.ok(res, { count: res.length });
  }


  // 2. Modify the phone number of an existing user
  async updatePhone(id: string, dto:UpdatePhoneDto) {
    const result = await this.adminRepository.update(id, { phone: dto.phone, updatedAt: new Date() });

    if (result.affected === 0) {
      return this.ok(null, { message: 'Admin not found' });
    }

    const updatedAdmin = await this.adminRepository.findOne({ where: { id } });
    this.audits.push({
      id: 'log_' + Date.now(),
      type: 'phone-update',
      adminId: id,
      at: new Date(),
    });

    return this.ok(updatedAdmin, { message: 'Phone number updated' });
  }

  //admin search by id
async search(id: string) {
  const admins = await this.adminRepository.find({
     where: { 
     
    id: Like(`%${id}%`)}, 
    select: ['id', 'name'],
   

  }); 
  return this.ok(admins);

}

// //NUll names admin fetch
private Success(data: any, extra: Record<string, any> = {}) {
    return { success: true, ...extra, data };
  }

async findAdminsWithNullName(query: GetNullNamesDto) {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const [admins, total] = await this.adminRepository.findAndCount({
    where: {
      name:IsNull(),   // <-- ONLY THIS NEEDED
    },
    skip,
    take: limit,
  });

  return this.Success(admins, {
    page,
    limit,
    total,
    message: `Admins with null names retrieved successfully`,
  });
}


async assignBuyer(adminId: string, buyerId: string) {
  const admin = await this.adminRepository.findOne({ where: { id: adminId } });
 const buyer = await this.buyerRepository.findOne({ where: { id:buyerId } });


  if (!admin || !buyer) {
    return { success: false, message: 'Admin or Buyer not found' };
  }

  buyer.admin = admin;
  await this.buyerRepository.save(buyer);

  return { success: true, message: 'Buyer assigned to Admin', data: buyer };
}

async getBuyers(adminId: string) {
  return this.buyerRepository.find({
    where: { admin: { id: adminId } },
  });
}


}