import { Controller, Post, Body, Get } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('test-email')
  async testEmail(@Body() data: { email: string; name: string }) {
    return await this.mailerService.sendWelcomeEmail(data.email, data.name);
  }

  @Post('test-order')
  async testOrderEmail(
    @Body() data: { email: string; buyerName: string; orderId: string; total: number }
  ) {
    return await this.mailerService.sendOrderConfirmationEmail(
      data.email,
      data.buyerName,
      data.orderId,
      data.total,
    );
  }

  @Get('health')
  healthCheck() {
    return { message: 'Mailer service is up and running' };
  }
}
