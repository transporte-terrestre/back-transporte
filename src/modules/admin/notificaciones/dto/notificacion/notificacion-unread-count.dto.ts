import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsIn, IsString } from 'class-validator';
import { notificacionDestino } from '@db/tables/notificacion.table';
import type { NotificacionDestino } from '@db/tables/notificacion.table';

export class UnreadCountQueryDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 1,
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Filtrar por destino',
    enum: notificacionDestino.enumValues,
    required: false,
  })
  @IsOptional()
  @IsIn(notificacionDestino.enumValues)
  destino?: NotificacionDestino;

  @ApiProperty({
    description: 'Filtrar por entidad en metadata (ej: conductor, vehiculo)',
    example: 'conductor',
    required: false,
  })
  @IsOptional()
  @IsString()
  entidad?: string;

  @ApiProperty({
    description: 'Fecha de inicio para filtrar (ISO 8601)',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  fechaInicio?: string;

  @ApiProperty({
    description: 'Fecha de fin para filtrar (ISO 8601)',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  fechaFin?: string;
}

export class UnreadCountResultDto {
  @ApiProperty({
    description: 'Cantidad de notificaciones no leídas',
    example: 5,
  })
  count: number;
}
