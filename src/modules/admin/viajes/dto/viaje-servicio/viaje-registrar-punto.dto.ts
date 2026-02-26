import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ViajeRegistrarBaseDto } from './viaje-registrar-base.dto';

export class ViajeRegistrarPuntoDto extends ViajeRegistrarBaseDto {
  @ApiProperty({ example: 1, description: 'ID de la parada de la ruta programada' })
  @IsNotEmpty()
  @IsInt()
  rutaParadaId: number;
}
