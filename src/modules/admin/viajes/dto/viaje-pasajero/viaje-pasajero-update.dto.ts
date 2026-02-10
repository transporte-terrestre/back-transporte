import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ViajePasajeroUpdateDto {
  @ApiProperty({ example: true, description: 'Asistencia del pasajero' })
  @IsBoolean()
  @IsNotEmpty()
  asistencia: boolean;
}
