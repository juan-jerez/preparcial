/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // si no hay roles requeridos, permitir
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    this.logger.debug(
      `requiredRoles=${JSON.stringify(requiredRoles)} user=${JSON.stringify(user)}`,
    );

    if (!user) {
      this.logger.debug('Denied: no user on request');
      return false;
    }

    // normalizar user.roles a string[]
    let userRoles: string[] = [];
    if (Array.isArray(user.roles)) {
      if (
        user.roles.length > 0 &&
        typeof user.roles[0] === 'object' &&
        user.roles[0].role_name
      ) {
        userRoles = (user.roles as any[]).map((r) => r.role_name);
      } else {
        userRoles = user.roles as string[];
      }
    } else if (typeof user.roles === 'string') {
      userRoles = [user.roles];
    }

    const allowed = requiredRoles.some((r) => userRoles.includes(r));
    this.logger.debug(
      `userRoles=${JSON.stringify(userRoles)} allowed=${allowed}`,
    );
    return allowed;
  }
}
