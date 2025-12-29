import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return false;

    const resourceUserId =
      request.params?.userId ||
      request.params?.buyerId ||
      request.params?.sellerUserId ||
      request.body?.userId;

    if (!resourceUserId) return false;
    return resourceUserId === user.id;
  }
}
