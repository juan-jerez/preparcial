/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  BusinessError,
  BussinessLogicException,
} from 'src/shared/errors/business-errors';
import { UserDto } from './user.dto';
import { AssignRolesDto } from './assign-roles.dto';
import { RoleEntity } from 'src/role/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private readonly rolesRepo: Repository<RoleEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find({ relations: ['roles'] });
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async findById(id: string, p0: { relations: string[] }): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) {
      throw new BussinessLogicException(
        'User not found',
        BusinessError.NOT_FOUND,
      );
    }
    return user;
  }

  async update(id: string, dto: UserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BussinessLogicException(
        'User not found',
        BusinessError.NOT_FOUND,
      );
    }
    Object.assign(user, dto);

    return this.userRepository.save(user);
  }

  async assignRoles(id: string, dto: AssignRolesDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) {
      throw new BussinessLogicException(
        'User not found',
        BusinessError.NOT_FOUND,
      );
    }

    const roles = await this.rolesRepo.find({
      where: { role_name: In(dto.roles) },
    });

    if (roles.length !== dto.roles.length) {
      throw new BadRequestException('One or more roles are invalid');
    }

    if (roles.length !== dto.roles.length) {
      throw new BadRequestException('One or more roles are invalid');
    }

    user.roles = roles;
    await this.userRepository.save(user);

    return `Roles ${dto.roles} assigned to user ${id} successfully`;
  }
}
