import { ApiProperty } from '@nestjs/swagger';
import { ClienteListDto } from './cliente-list.dto';
import { PaginationMetaDto } from '../../../../common/dto/pagination-meta.dto';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, IsDateString, IsIn } from 'class-validator';
import { clientesTipoDocumento } from '@db/tables/cliente.model';
import type { ClienteTipoDocumento } from '@db/tables/cliente.model';

export class ClientePaginationQueryDto {
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
    description: 'Búsqueda por nombre, DNI, teléfono o email del cliente',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiProperty({
    description: 'Fecha de fin para filtrar por rango (formato: YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiProperty({
    description: 'Filtrar por tipo de documento',
    enum: clientesTipoDocumento.enumValues,
    example: clientesTipoDocumento.enumValues[0],
    required: false,
  })
  @IsOptional()
  @IsIn(clientesTipoDocumento.enumValues, { each: true })
  tipoDocumento?: ClienteTipoDocumento;
}

export class PaginatedClienteResultDto {
  @ApiProperty({
    description: 'Lista de clientes en la página actual',
    type: [ClienteListDto],
  })
  data: ClienteListDto[];

  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
