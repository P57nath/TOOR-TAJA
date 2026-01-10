import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('realtime')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Post('auth')
  @HttpCode(200)
  authenticate(
    @CurrentUser() user: { id: string; role: Role },
    @Body('socket_id') socketId: string,
    @Body('channel_name') channelName: string,
  ) {
    if (!socketId || !channelName) {
      throw new BadRequestException('Invalid auth request');
    }

    const isAllowed =
      (channelName === `private-buyer-${user.id}` && user.role === Role.BUYER) ||
      (channelName === `private-seller-${user.id}` && user.role === Role.SELLER) ||
      (channelName === 'private-admin' && user.role === Role.ADMIN);

    if (!isAllowed) {
      throw new ForbiddenException('Not allowed for this channel');
    }

    return this.notifications.authenticate(socketId, channelName);
  }

}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsQueryController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(
    @CurrentUser() user: { id: string; role: Role },
    @Query('limit') limit?: string,
  ) {
    const safeLimit = Number.isFinite(Number(limit)) ? Number(limit) : 20;
    return this.notifications.listForRole(user.role, user.id, safeLimit);
  }

  @Post('read')
  @HttpCode(200)
  async markRead(@CurrentUser() user: { id: string; role: Role }) {
    await this.notifications.markAllRead(user.role, user.id);
    return { success: true };
  }
}
