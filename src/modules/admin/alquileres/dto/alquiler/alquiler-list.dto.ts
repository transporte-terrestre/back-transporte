import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { AlquilerResultDto } from './alquiler-result.dto';

export class AlquilerFiltersDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  estado?: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value != null ? parseInt(value, 10) : undefined))
  @IsInt()
  @IsOptional()
  clienteId?: number;

  @ApiProperty({ required: false, enum: ['maquina_seca', 'maquina_operada'] })
  @IsString()
  @IsOptional()
  tipo?: string;
}

export class AlquilerQueryDto extends AlquilerFiltersDto {
  @ApiProperty({ required: false, default: 1 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}

export class AlquilerItemDto extends AlquilerResultDto {}

export class AlquilerPaginationMetaDto {
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
  @ApiProperty() hasNextPage: boolean;
  @ApiProperty() hasPreviousPage: boolean;
}

export class AlquilerListDto {
  @ApiProperty({ type: [AlquilerItemDto] })
  data: AlquilerItemDto[];

  @ApiProperty({ type: AlquilerPaginationMetaDto })
  meta: AlquilerPaginationMetaDto;
}
