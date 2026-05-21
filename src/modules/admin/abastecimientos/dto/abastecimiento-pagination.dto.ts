import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { AbastecimientoResultDto } from './abastecimiento-result.dto';

export class AbastecimientoPaginationQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  page: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  limit: number = 10;

  @ApiPropertyOptional({ example: 'ABC-123' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  vehiculoId?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  viajeTramoId?: number;
}

export class AbastecimientoPaginationMetaDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  hasPreviousPage: boolean;
}

export class PaginatedAbastecimientoResultDto {
  @ApiProperty({ type: [AbastecimientoResultDto] })
  data: AbastecimientoResultDto[];

  @ApiProperty({ type: AbastecimientoPaginationMetaDto })
  meta: AbastecimientoPaginationMetaDto;
}
