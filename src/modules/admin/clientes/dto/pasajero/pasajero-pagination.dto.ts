import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PasajeroPaginationQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Número de página' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Límite de items por página' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Término de búsqueda (DNI, nombres, apellidos)' })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID del cliente para filtrar' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  clienteId?: number;
}
