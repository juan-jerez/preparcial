import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class AppointmentDto {
  @IsString()
  readonly status: string;

  @IsDate()
  @IsNotEmpty()
  readonly datetime: Date;
}
