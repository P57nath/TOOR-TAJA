import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    NestMailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.MAIL_PORT || '587'),
        secure: false, 
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"TOOR-TAJA" <${process.env.MAIL_USER}>`,
      },
    }),
  ],
  providers: [MailerService],
  controllers: [],
  exports: [MailerService],
})
export class MailerModuleCustom {}
