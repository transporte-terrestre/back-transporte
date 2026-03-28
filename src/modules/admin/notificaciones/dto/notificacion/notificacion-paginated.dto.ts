import { ApiProperty } from '@nestjs/swagger';
import { NotificacionListDto } from './notificacion-list.dto';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsIn } from 'class-validator';
import { PaginationMetaDto } from '../../../../../common/dto/pagination-meta.dto';
import { notificacionDestino } from '@db/tables/notificacion.table';
import type { NotificacionDestino } from '@db/tables/notificacion.table';

export class NotificacionPaginationQueryDto {
  @ApiProperty({
    description: 'Número de página (comienza en 1)',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'ID del usuario',
    example: 1,
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Filtrar por destino del usuario',
    enum: notificacionDestino.enumValues,
    example: notificacionDestino.enumValues[0],
    required: false,
  })
  @IsOptional()
  @IsIn(notificacionDestino.enumValues)
  destino?: NotificacionDestino;
}

export class ConductorNotificationQueryDto {
  @ApiProperty({
    description: 'Número de página (comienza en 1)',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class PaginatedNotificacionResultDto {
  @ApiProperty({
    description: 'Lista de notificaciones',
    type: [NotificacionListDto],
  })
  data: NotificacionListDto[];

  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
