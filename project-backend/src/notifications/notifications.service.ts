import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Pusher from 'pusher';
import { Repository } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';
import { Notification } from './notification.entity';

export type NotificationPayload = {
  title: string;
  body: string;
  meta?: Record<string, any>;
  createdAt: string;
  id?: string;
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly pusher: Pusher | null;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {
    const appId = process.env.PUSHER_APP_ID;
    const key = process.env.PUSHER_KEY;
    const secret = process.env.PUSHER_SECRET;
    const cluster = process.env.PUSHER_CLUSTER;

    if (!appId || !key || !secret || !cluster) {
      this.logger.warn('Pusher env missing. Notifications disabled.');
      this.pusher = null;
      return;
    }

    this.pusher = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });
  }

  buildPayload(title: string, body: string, meta?: Record<string, any>): NotificationPayload {
    return {
      title,
      body,
      meta,
      createdAt: new Date().toISOString(),
    };
  }

  authenticate(socketId: string, channelName: string) {
    if (!this.pusher) {
      throw new Error('Pusher not configured');
    }
    return this.pusher.authenticate(socketId, channelName);
  }

  async notifyBuyer(userId: string, payload: NotificationPayload) {
    const saved = await this.persist(Role.BUYER, userId, payload);
    await this.trigger(`private-buyer-${userId}`, {
      ...payload,
      id: saved?.id,
    });
  }

  async notifySeller(userId: string, payload: NotificationPayload) {
    const saved = await this.persist(Role.SELLER, userId, payload);
    await this.trigger(`private-seller-${userId}`, {
      ...payload,
      id: saved?.id,
    });
  }

  async notifyAdmin(payload: NotificationPayload) {
    const saved = await this.persist(Role.ADMIN, null, payload);
    await this.trigger('private-admin', { ...payload, id: saved?.id });
  }

  async listForRole(role: Role, userId?: string, limit = 20) {
    const qb = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.role = :role', { role })
      .orderBy('notification.createdAt', 'DESC')
      .take(limit);

    if (role !== Role.ADMIN) {
      qb.andWhere('notification.userId = :userId', { userId });
    }

    return qb.getMany();
  }

  async markAllRead(role: Role, userId?: string) {
    const qb = this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where('role = :role', { role });

    if (role !== Role.ADMIN) {
      qb.andWhere('userId = :userId', { userId });
    }

    await qb.execute();
  }

  private async trigger(channel: string, payload: NotificationPayload) {
    if (!this.pusher) return;
    try {
      await this.pusher.trigger(channel, 'notification', payload);
    } catch (error) {
      this.logger.warn(`Pusher trigger failed for ${channel}`);
      this.logger.debug(error instanceof Error ? error.message : String(error));
    }
  }

  private async persist(role: Role, userId: string | null, payload: NotificationPayload) {
    try {
      const record = this.notificationRepository.create({
        role,
        userId: userId ?? null,
        title: payload.title,
        body: payload.body,
        meta: payload.meta ?? null,
      });
      return await this.notificationRepository.save(record);
    } catch (error) {
      this.logger.warn('Failed to persist notification');
      this.logger.debug(error instanceof Error ? error.message : String(error));
      return null;
    }
  }
}
