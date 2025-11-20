import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RolesController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleService],
  controllers: [RolesController],
})
export class RoleModule {}
