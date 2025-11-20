/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentDto } from './appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async createAppointment(@Body() : AppointmentDto) {
    const appointment = await this.appointmentService.create();
    return { statusCode: HttpStatus.CREATED, data: appointment };
  }
}
