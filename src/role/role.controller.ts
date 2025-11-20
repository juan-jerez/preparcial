/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/decorators/roles.decorator';
import { RolesGuard } from '../shared/guards/roles.guard';
import { RoleService } from './role.service';
import { CreateRoleDto } from './role.dto'; // <-- usar DTO

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async createRole(@Body() payload: CreateRoleDto) {
    const role = await this.roleService.create(payload);
    return { statusCode: HttpStatus.CREATED, data: role };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async getRoles() {
    const roles = await this.roleService.findAll();
    return { statusCode: HttpStatus.OK, data: roles };
  }
}
