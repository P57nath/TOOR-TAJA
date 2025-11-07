import {
  Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Put, Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuditQueryDto, PageQueryDto } from './dto/query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // (1) POST /admin/users  -> create admin
  @Post('users')
  @UseInterceptors(
    FileInterceptor('profileFile', {
      storage: diskStorage({
        destination: './upload',
        filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  create(
    @Body(new ValidationPipe()) dto: CreateAdminDto,
    @UploadedFile(
      new ParseFilePipe({ 
        validators: [
          new MaxFileSizeValidator({ maxSize: 3_000_000 }),                 
          // new FileTypeValidator({ fileType: /(image\/(png|jpe?g|webp))$/i }),
          //new FileTypeValidator({ fileType: /\.(png|jpe?g|webp)$/i }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    dto.profileName = file?.filename;
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
