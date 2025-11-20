/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RegisterDTO } from './register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterDTO,
  ): Promise<{ message: string; userId: string }> {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const created = await this.userService.create({
      email: dto.email,
      password: hashed,
      name: dto.name,
      phone: dto.phone,
    });

    return { message: 'User registered successfully', userId: created.id };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('User account is inactive');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: (user.roles || []).map((role) => role.role_name),
    };

    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async validateUserById(id: string) {
    return await this.userService.findById(id, { relations: ['roles'] });
  }
}
