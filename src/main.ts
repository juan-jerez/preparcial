/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './user/user.entity';
import { RoleEntity } from './role/role.entity';

async function seedAdmin(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(RoleEntity);
  const userRepo = dataSource.getRepository(UserEntity);

  const adminEmail = String(process.env.ADMIN_EMAIL || 'admin@example.com');
  const adminPassword = String(process.env.ADMIN_PASSWORD || 'admin123');
  const adminName = String(process.env.ADMIN_NAME || 'Administrator');

  let adminRole = await roleRepo.findOne({ where: { role_name: 'admin' } });
  if (!adminRole) {
    adminRole = roleRepo.create({
      role_name: 'admin',
      description: 'Administrator role',
    });
    adminRole = await roleRepo.save(adminRole);
  }

  const existing = await userRepo.findOne({
    where: { email: adminEmail },
    relations: ['roles'],
  });

  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    const adminUser = userRepo.create({
      email: adminEmail,
      password: hashed,
      name: adminName,
      phone: null,
      is_active: true,
      roles: [adminRole],
    });
    await userRepo.save(adminUser);
  } else {
    const hasAdminRole = (existing.roles || []).some(
      (r) => r.role_name === 'admin',
    );
    if (!hasAdminRole) {
      existing.roles = [...(existing.roles || []), adminRole];
      await userRepo.save(existing);
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  try {
    const dataSource = app.get(DataSource);
    if (!dataSource) {
      throw new Error(
        'TypeORM DataSource no disponible. Revisa TypeOrmModule.forRoot.',
      );
    }
    await seedAdmin(dataSource);
  } catch (err) {
    console.error('Error during seeding:', err);
  }

  await app.listen(3000);
}
bootstrap();
