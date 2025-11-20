/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/decorators/roles.decorator';
import { RolesGuard } from '../shared/guards/roles.guard';
import { AssignRolesDto } from './assign-roles.dto';
import type { Request } from 'express';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async findAllUsers() {
    const users = await this.userService.findAll();
    return { statusCode: HttpStatus.OK, data: users };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    return (req as any).user;
  }

  @Patch(':id/roles')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async assignRoles(@Param('id') id: string, @Body() dto: AssignRolesDto) {
    const updated = await this.userService.assignRoles(id, {
      roles: dto.roles,
    });
    if (!updated) throw new NotFoundException('User not found');
    return { statusCode: HttpStatus.OK, data: updated };
  }
}
