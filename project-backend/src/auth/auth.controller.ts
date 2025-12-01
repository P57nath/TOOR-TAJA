import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import passport from 'passport';
import { CreateBuyerDto } from 'src/buyer/dto/buyerProfileDtos/create-buyer.dto';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { CreateSellerDto } from 'src/seller/dto/create-seller.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }

    @Post('register/buyer')
    async registerBuyer(@Body() dto: CreateBuyerDto) {
        return this.authService.registerBuyer(dto);
    }

    
    @Post('register/admin')
    @UseInterceptors(
        FileInterceptor('profileFile', {
          fileFilter: (req, file, cb) => {
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
    async registerAdmin(@Body() dto: CreateAdminDto,
    @UploadedFile() file?: Express.Multer.File,) {
        dto.profileName = file?.filename;
        return this.authService.registerAdmin(dto);
    }

    @Post('register/seller')
    async registerSeller(@Body() dto: CreateSellerDto) {
        return this.authService.registerSeller(dto);
    }
}
