import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { mixin } from '@nestjs/common';

function getTokenFromRequest(req: Request) {
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (!auth) return null;
  const parts = String(auth).split(' ');
  if (parts.length !== 2) return null;
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return null;
  return token;
}

export const RoleGuard = (requiredRole?: string): any => {
  @Injectable()
  class MixinRoleGuard implements CanActivate {
    constructor(public readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest<Request>();
      const token = getTokenFromRequest(req);
      if (!token) throw new UnauthorizedException('Missing authorization token');

      try {
        const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
        // attach user to request for handlers
        (req as any).user = { userId: payload.sub, email: payload.email, role: payload.role };

        if (!requiredRole) return true;
        return payload.role === requiredRole;
      } catch (err) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }

  return mixin(MixinRoleGuard);
};

export const AuthGuard: any = RoleGuard();
