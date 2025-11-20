/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentEntity } from './appointment.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BussinessLogicException,
} from 'src/shared/errors/business-errors';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
  ) {}

  async findOne(id: string): Promise<AppointmentEntity> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!appointment)
      throw new BussinessLogicException(
        'La cita con el id dado no existe',
        BusinessError.NOT_FOUND,
      );

    return appointment;
  }

  async findAll(): Promise<AppointmentEntity[]> {
    return await this.appointmentRepository.find({ relations: ['user'] });
  }

  async create(appointment: AppointmentEntity): Promise<AppointmentEntity> {
    return await this.appointmentRepository.save(appointment);
  }

  async update(
    id: string,
    appointment: AppointmentEntity,
  ): Promise<AppointmentEntity> {
    const persistedAppointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!persistedAppointment) {
      throw new BussinessLogicException(
        'la cita con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    appointment.id = id;

    return await this.appointmentRepository.save(appointment);
  }

  async delete(id: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment)
      throw new BussinessLogicException(
        'La cita con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
  }
}
