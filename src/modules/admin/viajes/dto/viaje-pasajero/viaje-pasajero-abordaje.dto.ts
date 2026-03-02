import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class ViajePasajeroAbordajeDto {
  @ApiProperty({ example: 1, description: 'ID del registro de pasajero en el viaje (viaje_pasajeros)' })
  @IsInt()
  @IsNotEmpty()
  viajePasajeroId: number;

  @ApiProperty({ example: true, description: 'Estado de asistencia/abordaje' })
  @IsBoolean()
  @IsNotEmpty()
  asistencia: boolean;
}
