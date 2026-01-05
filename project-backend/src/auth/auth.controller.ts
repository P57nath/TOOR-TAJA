import { Body, Controller, Post, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import express from 'express';
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
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
        const result = await this.authService.login(dto.email, dto.password);
        const token = (result as any)?.access_token;
        if (token) {
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            });
            return { message: 'Logged in', role: (result as any)?.role };
        }
        return result;
    }

    @Post('register/buyer')
    async registerBuyer(@Body() dto: CreateBuyerDto) {
        return this.authService.registerBuyer(dto);
        // return await this.mailerService.sendWelcomeEmail(data.email, data.name);
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
