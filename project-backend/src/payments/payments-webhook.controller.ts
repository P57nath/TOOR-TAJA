import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PaymentsService } from './payments.service';

@Controller('payments/sslcommerz')
export class PaymentsWebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('success')
  async success(@Body() body: any, @Res() res: Response) {
    const intentId = body?.tran_id;
    if (intentId) {
      await this.paymentsService.markSuccess(intentId);
    }
    const frontendUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/buyer/payments/history?status=success`);
  }

  @Post('fail')
  async fail(@Body() body: any, @Res() res: Response) {
    const intentId = body?.tran_id;
    if (intentId) {
      await this.paymentsService.markFailed(intentId);
    }
    const frontendUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/buyer/payments/history?status=failed`);
  }

  @Post('cancel')
  async cancel(@Body() body: any, @Res() res: Response) {
    const intentId = body?.tran_id;
    if (intentId) {
      await this.paymentsService.markFailed(intentId);
    }
    const frontendUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/buyer/payments/history?status=cancelled`);
  }

  @Post('ipn')
  async ipn(@Body() body: any) {
    const intentId = body?.tran_id;
    const status = body?.status;
    if (intentId && status === 'VALID') {
      await this.paymentsService.markSuccess(intentId);
    }
    return { success: true };
  }
}
