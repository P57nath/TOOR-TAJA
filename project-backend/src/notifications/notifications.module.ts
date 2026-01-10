import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import {
  NotificationsController,
  NotificationsQueryController,
} from './notifications.controller';
import { Notification } from './notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationsService],
  controllers: [NotificationsController, NotificationsQueryController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
