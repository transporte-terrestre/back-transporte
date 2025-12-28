import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString } from 'class-validator';
import { TareaListDto } from './tarea-list.dto';
import { PaginationMetaDto } from '../../../../common/dto/pagination-meta.dto';

export class TareaPaginationQueryDto {
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

  @ApiPropertyOptional({
    description: 'Búsqueda por código o descripción',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class PaginatedTareaResultDto {
  @ApiProperty({
    description: 'Lista de tareas en la página actual',
    type: [TareaListDto],
  })
  data: TareaListDto[];

  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
