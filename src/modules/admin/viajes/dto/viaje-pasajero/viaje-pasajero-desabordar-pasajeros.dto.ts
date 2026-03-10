import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class ViajePasajeroDesabordarPasajerosDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'IDs de los registros de pasajeros en el viaje (viaje_pasajeros) que bajan del vehículo',
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  viajePasajeroIds: number[];
}
