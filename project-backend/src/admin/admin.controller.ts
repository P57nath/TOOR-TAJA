import {
  Body, Controller, Delete, Get, Param, Patch, Post, Put, Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuditQueryDto, PageQueryDto } from './dto/query.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // (1) POST /admin/users  -> create admin
  @Post('users')
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  // (2) GET /admin/users-> list admins
  @Get('users')
  findAll(@Query() q: PageQueryDto) {
    return this.adminService.findAll(q);
  }

  // (3) GET /admin/users/:id  -> get one admin
  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Get('users/:id/dates')
  findOne2(@Param('id') id: string) {
    return this.adminService.findOne2(id);
  }

  // (4) PUT /admin/users/:id  -> full replace (Body + Param)
  @Put('users/:id')
  replace(@Param('id') id: string, @Body() dto: CreateAdminDto) {
    return this.adminService.replace(id, dto);
  }

  // (5) PATCH /admin/users/:id  -> partial update (Body + Param)
  @Patch('users/:id')
  update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return this.adminService.update(id, dto);
  }

  // (6) DELETE /admin/users/:id  -> delete (Param)
  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  // (7) PATCH /admin/users/:id/role  -> targeted role change (Body + Param)
  @Patch('users/:id/role')
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.adminService.updateRole(id, dto);
  }

  // (8) GET /admin/audit-logs?type=&from=&to=  
  @Get('audit-logs')
  audit(@Query() q: AuditQueryDto) {
    return this.adminService.getAuditLogs(q);
  }
}
