import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  private readonly appUrl = process.env.APP_URL || 'http://localhost:3000';

  constructor(private readonly mailerService: NestMailerService) {}

  private async sendEmail(email: string, subject: string, html: string) {
    try {
      await this.mailerService.sendMail({ to: email, subject, html });
      return { success: true, message: 'Email sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendBuyerWelcomeEmail(email: string, name: string) {
    const html = `
      <h1>Welcome to TOOR-TAJA!</h1>
      <p>Hi ${name},</p>
      <p>Thanks for joining. Your account is ready.</p>
      <p>Login to start shopping.</p>
      <br/>
      <p>Best regards,<br/>TOOR-TAJA Team</p>
    `;
    return this.sendEmail(email, 'Welcome to TOOR-TAJA', html);
  }

  async sendSellerApplicationReceivedEmail(email: string, storeName: string) {
    const html = `
      <h1>Seller Application Received</h1>
      <p>Hi ${storeName},</p>
      <p>We received your seller application. Our team will review it shortly.</p>
      <br/>
      <p>TOOR-TAJA Team</p>
    `;
    return this.sendEmail(email, 'Seller application received', html);
  }

  async sendSellerApprovedEmail(email: string, storeName: string) {
    const html = `
      <h1>Seller Account Approved</h1>
      <p>Hi ${storeName},</p>
      <p>Your seller account is approved. You can now list products.</p>
      <p><a href="${this.appUrl}/seller/dashboard">Go to Seller Dashboard</a></p>
      <br/>
      <p>Happy selling,<br/>TOOR-TAJA Team</p>
    `;
    return this.sendEmail(email, 'Seller account approved', html);
  }

  async sendAdminWelcomeEmail(email: string, displayName: string) {
    const html = `
      <h1>Admin Access Granted</h1>
      <p>Hi ${displayName},</p>
      <p>Your admin access is ready. Please sign in to manage the platform.</p>
      <p><a href="${this.appUrl}/admin/login">Go to Admin Login</a></p>
      <br/>
      <p>TOOR-TAJA Team</p>
    `;
    return this.sendEmail(email, 'Admin access ready', html);
  }

  async sendGenericEmail(email: string, subject: string, html: string) {
    return this.sendEmail(email, subject, html);
  }
}
