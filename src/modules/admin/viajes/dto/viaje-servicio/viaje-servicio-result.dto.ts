import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ViajeServicioResultDto {
  @ApiProperty({ example: 1, description: 'ID del servicio' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID del viaje al que pertenece' })
  viajeId: number;

  @ApiProperty({ example: 1, description: 'Orden del servicio en el día' })
  orden: number;

  @ApiProperty({ example: 'trayecto', description: 'Tipo de servicio (trayecto, descanso)' })
  tipo: string;

  @ApiPropertyOptional({ example: -77.0282, description: 'Longitud mapeada' })
  longitud?: number;

  @ApiPropertyOptional({ example: -12.0432, description: 'Latitud mapeada' })
  latitud?: number;

  @ApiPropertyOptional({ example: 'Almacen Central', description: 'Nombre descriptivo' })
  nombreLugar?: string;

  @ApiPropertyOptional({ example: '2024-03-24T10:30:00Z', description: 'Hora referencial' })
  horaFinal?: Date;

  @ApiPropertyOptional({ example: 94891, description: 'Kilometraje reportado' })
  kilometrajeFinal?: number;

  @ApiPropertyOptional({ example: 12, description: 'Número de pasajeros' })
  numeroPasajeros?: number;

  @ApiPropertyOptional({ example: 'Parada extendida', description: 'Observaciones' })
  observaciones?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  creadoEn: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  actualizadoEn: Date;
}
