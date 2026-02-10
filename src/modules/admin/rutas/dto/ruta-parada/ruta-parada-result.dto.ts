import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RutaParadaResultDto {
  @ApiProperty({ example: 1, description: 'ID de la parada' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID de la ruta a la que pertenece' })
  rutaId: number;

  @ApiProperty({ example: 1, description: 'Orden de la parada en la ruta' })
  orden: number;

  @ApiProperty({ example: 'PEIP - Educans', description: 'Nombre de la parada' })
  nombre: string;

  @ApiPropertyOptional({ example: '-12.0464', description: 'Latitud de la ubicación' })
  ubicacionLat?: string;

  @ApiPropertyOptional({ example: '-77.0428', description: 'Longitud de la ubicación' })
  ubicacionLng?: string;

  @ApiPropertyOptional({ example: '10.5', description: 'Distancia desde la parada anterior' })
  distanciaPreviaParada?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  creadoEn: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  actualizadoEn: Date;
}
