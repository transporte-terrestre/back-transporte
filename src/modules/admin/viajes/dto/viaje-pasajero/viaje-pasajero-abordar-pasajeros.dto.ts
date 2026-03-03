import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class ViajePasajeroAbordarPasajerosDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'IDs de los registros de pasajeros en el viaje (viaje_pasajeros)',
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  viajePasajeroIds: number[];
}
