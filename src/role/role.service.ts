import { Injectable, ConflictException } from '@nestjs/common';
import { RoleEntity } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(payload: CreateRoleDto): Promise<RoleEntity> {
    const existing = await this.roleRepository.findOne({
      where: { role_name: payload.role_name },
    });
    if (existing) throw new ConflictException('Role already exists');

    const role = this.roleRepository.create(payload as unknown as RoleEntity);
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<RoleEntity[]> {
    return await this.roleRepository.find({ relations: ['users'] });
  }
}
