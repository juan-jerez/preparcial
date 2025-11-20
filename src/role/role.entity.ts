import { UserEntity } from '../user/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  role_name: string;

  @Column()
  description: string;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];
}
