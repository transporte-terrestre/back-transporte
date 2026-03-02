import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Min, IsInt } from 'class-validator';
import { PaginationMetaDto } from '@common/dto/pagination-meta.dto';
import { SucursalListDto } from './sucursal-list.dto';

export class SucursalPaginationQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Buscar por nombre o dirección' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, description: 'Fecha de inicio (YYYY-MM-DD)' })
  @IsString()
  @IsOptional()
  fechaInicio?: string;

  @ApiProperty({ required: false, description: 'Fecha de fin (YYYY-MM-DD)' })
  @IsString()
  @IsOptional()
  fechaFin?: string;
}

export class PaginatedSucursalResultDto {
  @ApiProperty({ type: [SucursalListDto] })
  data: SucursalListDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
