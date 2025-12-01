import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    const html = `
      <h1>Welcome to TOOR-TAJA!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for registering with us. Your account has been created successfully.</p>
      <p>You can now login and start using our platform.</p>
      <br/>
      <p>Best regards,<br/>TOOR-TAJA Team</p>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to TOOR-TAJA',
        html,
      });
      return { success: true, message: 'Welcome email sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendOrderConfirmationEmail(email: string, buyerName: string, orderId: string, total: number) {
    const html = `
      <h1>Order Confirmation</h1>
      <p>Hi ${buyerName},</p>
      <p>Your order has been confirmed!</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Amount:</strong> $${total}</p>
      <p>We will notify you when your order ships.</p>
      <br/>
      <p>Thank you for shopping with us,<br/>TOOR-TAJA Team</p>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Order Confirmation - ${orderId}`,
        html,
      });
      return { success: true, message: 'Order confirmation email sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    const html = `
      <h1>Password Reset Request</h1>
      <p>We received a request to reset your password.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>If you didn't request this, ignore this email.</p>
      <p>This link expires in 1 hour.</p>
      <br/>
      <p>TOOR-TAJA Team</p>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        html,
      });
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendSellerActivationEmail(email: string, sellerName: string) {
    const html = `
      <h1>Seller Account Activated</h1>
      <p>Hi ${sellerName},</p>
      <p>Congratulations! Your seller account has been activated.</p>
      <p>You can now start listing products on TOOR-TAJA.</p>
      <p><a href="http://localhost:3000/seller/dashboard">Go to Seller Dashboard</a></p>
      <br/>
      <p>Happy selling,<br/>TOOR-TAJA Team</p>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Seller Account Activated',
        html,
      });
      return { success: true, message: 'Seller activation email sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendAdminCredentialsEmail(email: string, adminName: string, adminId: string, tempPassword: string) {
    const html = `
      <h1>Admin Account Created</h1>
      <p>Hi ${adminName},</p>
      <p>Your admin account has been created successfully.</p>
      <p><strong>Admin ID:</strong> ${adminId}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      <p>Please change this password after first login.</p>
      <p><a href="http://localhost:3000/admin/login">Go to Admin Login</a></p>
      <br/>
      <p>TOOR-TAJA Team</p>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Admin Account Credentials',
        html,
      });
      return { success: true, message: 'Admin credentials email sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendShipmentNotificationEmail(email: string, buyerName: string, orderId: string, trackingNumber: string) {
    const html = `
      <h1>Your Order Has Shipped!</h1>
      <p>Hi ${buyerName},</p>
      <p>Great news! Your order is on its way.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      <p>You can track your shipment using the tracking number above.</p>
      <br/>
      <p>Thank you for your purchase,<br/>TOOR-TAJA Team</p>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Shipment Notification - Order ${orderId}`,
        html,
      });
      return { success: true, message: 'Shipment notification email sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendGenericEmail(email: string, subject: string, html: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        html,
      });
      return { success: true, message: 'Email sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
