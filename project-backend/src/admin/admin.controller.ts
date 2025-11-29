import {
  Body, Controller, Delete, UsePipes, Res, Get, Param, Patch, Post, Put, Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
  ParseDatePipe,

}
  from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuditQueryDto, PageQueryDto } from './dto/query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { GetNullNamesDto } from './dto/getNullNames.dto';


@Controller('admin')
@UsePipes(new ValidationPipe({ transform: true }))
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // (1) POST /admin/users  -> create admin
  @Post('users')
  @UseInterceptors(
    FileInterceptor('profileFile', {
      fileFilter: (req, file, cb) => {
        // Check file type
        if (!file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }


        if (file.size > 2_000_000) {
          return cb(new Error('File size too large! Maximum is 2MB'), false);
        }

        cb(null, true);
      },
      storage: diskStorage({
        destination: './upload',
        filename: (_req, file, cb) => cb(null, Date.now() + file.originalname),
      }),
      limits: {
        fileSize: 2_000_000, // 2 MB
      },
    }),
  )

  create(
    @Body() dto: CreateAdminDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    dto.profileName = file?.filename;
    return this.adminService.create(dto);
  }
  // Retrieve users with null values in the full name column
  @Get('users/nullnames')
  findAdminsWithNullName(@Query() query: GetNullNamesDto) {
    return this.adminService.findAdminsWithNullName(query);
  }
  ///to fetch image
  @Get('/getimage/:name')
  getImages(@Param('name') name: string, @Res() res) {
    res.sendFile(name, { root: './upload' })
  }

  // (2) GET /admin/users-> list admins
  @Get('users/:isActive')
  findActive(
    @Param('isActive') isActive: string,
    @Query() q: PageQueryDto,
  ) {
    return this.adminService.findActive(q, isActive);
  }

  // (3) GET /admin/users/:id  -> get one admin
  @Get('users/:id')
  findOne(@Param('id') id: string) {

    return this.adminService.findOne(id);
  }




  // (4) PUT /admin/users/:id  -> full replace (Body + Param)
 @Put('users/:id')
@UseInterceptors(FileInterceptor('profileName', {
  storage: diskStorage({
    destination: './upload',
    filename: (_req, file, cb) => cb(null, Date.now() + file.originalname)
  }),
  limits: { fileSize: 2_000_000 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
}))
replace(
  @Param('id') id: string,
  @Body() dto: CreateAdminDto,
  @UploadedFile() file?: Express.Multer.File
) {
  if (file) dto.profileName = file.filename;
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

  // Operation 2: Modify the phone number of an existing user
  @Patch('users/:id/phone')
  updatePhone(@Param('id') id: string, @Body() dto: UpdatePhoneDto) {
    return this.adminService.updatePhone(id, dto);
  }

  //Retrieve users with null values in the full name column



  // Search for admins by their ID
  @Get('users/search/:id')
  search(@Param('id') id: string) {
    return this.adminService.search(id);
  }


  @Post(':adminId/assign-buyer/:buyerId')
assignBuyer(
  @Param('adminId') adminId: string,
  @Param('buyerId') buyerId: string,
) {
  return this.adminService.assignBuyer(adminId, buyerId);
}

@Get(':id/buyers')
getBuyers(@Param('id') id: string) {
  return this.adminService.getBuyers(id);
}


}
