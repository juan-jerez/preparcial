/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret',
    });
  }

  async validate(payload: any) {
    this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`);
    const user = await this.userService.findById(payload.sub, {
      relations: ['roles'],
    });
    this.logger.debug(`User from DB: ${user ? user.email : 'not found'}`);
    if (!user) return null;

    const roles: string[] = (user.roles || []).map((r: any) => r.role_name);
    const { password, ...rest } = user as any;
    const userForRequest = { ...rest, roles };
    this.logger.debug(`userForRequest: ${JSON.stringify(userForRequest)}`);
    return userForRequest;
  }
}
