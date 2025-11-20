/* eslint-disable @typescript-eslint/no-unsafe-return */
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: string;

  @Column()
  datetime: Date;

  @Column()
  stauts: string;

  @ManyToOne(() => UserEntity, (user) => user.appointments)
  user: UserEntity;
}
