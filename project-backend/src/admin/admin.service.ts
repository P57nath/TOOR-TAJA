import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuditQueryDto, PageQueryDto } from './dto/query.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  private admins: Admin[] = [
    {
      id: 'a_1',
      email: 'root@toor-taja.com',
      name: 'Root',
      role: 'superadmin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  private audits: any[] = [];

  private ok(data: any, extra: Record<string, any> = {}) {
    return { success: true, ...extra, data };
  }

  create(dto: CreateAdminDto) {
    const item: Admin = {
      id: 'a_' + Date.now(),
      email: dto.email,
      name: dto.name,
      role: dto.role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.admins.push(item);
    this.audits.push({ id: 'log_' + Date.now(), type: 'create', adminId: item.id, at: new Date() });
    return this.ok(item, { message: 'Admin created' });
  }

  findAll(q: PageQueryDto) {
    const page = Number(q.page ?? 1);
    const limit = Number(q.limit ?? 20);
    let res = [...this.admins];

    if (q.search) {
      const s = q.search.toLowerCase();
      res = res.filter(a => a.name.toLowerCase().includes(s) || a.email.toLowerCase().includes(s));
    }
    if (q.role) res = res.filter(a => a.role === q.role);
    if (q.active === 'true' || q.active === 'false') {
      const flag = q.active === 'true';
      res = res.filter(a => a.isActive === flag);
    }

    const total = res.length;
    const data = res.slice((page - 1) * limit, page * limit);
    return this.ok(data, { page, limit, total });
  }

  findOne(id: string) {
    const item = this.admins.find(a => a.id === id);
    return this.ok(item ?? null);
  }

  replace(id: string, dto: CreateAdminDto) {
    const idx = this.admins.findIndex(a => a.id === id);
    const now = new Date();
    const base: Admin = {
      id,
      email: dto.email,
      name: dto.name,
      role: dto.role,
      isActive: true,
      createdAt: idx >= 0 ? this.admins[idx].createdAt : now,
      updatedAt: now,
    };
    if (idx >= 0) this.admins[idx] = base; else this.admins.push(base);
    this.audits.push({ id: 'log_' + Date.now(), type: 'replace', adminId: id, at: now });
    return this.ok(base, { message: 'Admin replaced' });
  }

  update(id: string, dto: UpdateAdminDto) {
    const item = this.admins.find(a => a.id === id);
    if (!item) return this.ok(null, { message: 'Not found' });

    Object.assign(item, dto, { updatedAt: new Date() });
    this.audits.push({ id: 'log_' + Date.now(), type: 'update', adminId: id, at: new Date() });
    return this.ok(item, { message: 'Admin updated' });
  }

  remove(id: string) {
    const before = this.admins.length;
    this.admins = this.admins.filter(a => a.id !== id);
    this.audits.push({ id: 'log_' + Date.now(), type: 'delete', adminId: id, at: new Date() });
    return this.ok({ removed: before - this.admins.length }, { message: 'Admin deleted' });
  }

  updateRole(id: string, dto: UpdateRoleDto) {
    const item = this.admins.find(a => a.id === id);
    if (!item) return this.ok(null, { message: 'Not found' });

    item.role = dto.role;
    item.updatedAt = new Date();
    this.audits.push({
      id: 'log_' + Date.now(),
      type: 'role-change',
      adminId: id,
      detail: dto.reason,
      at: new Date(),
    });
    return this.ok(item, { message: 'Role updated' });
  }

  getAuditLogs(q: AuditQueryDto) {
    let res = [...this.audits];
    if (q.type) res = res.filter(l => l.type === q.type);
    if (q.from) res = res.filter(l => new Date(l.at) >= new Date(q.from!));
    if (q.to) res = res.filter(l => new Date(l.at) <= new Date(q.to!));
    return this.ok(res, { count: res.length });
  }
}
