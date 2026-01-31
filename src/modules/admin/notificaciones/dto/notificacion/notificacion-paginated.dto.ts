import { ApiProperty } from '@nestjs/swagger';
import { NotificacionListDto } from './notificacion-list.dto';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { PaginationMetaDto } from '../../../../../common/dto/pagination-meta.dto';

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
