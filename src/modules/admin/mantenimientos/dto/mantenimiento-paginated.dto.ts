import { ApiProperty } from "@nestjs/swagger";
import { MantenimientoResultDto } from "./mantenimiento-result.dto";
import { Type } from "class-transformer";
import {
  IsInt,
  IsOptional,
  Min,
  Max,
  IsString,
  IsDateString,
  IsIn,
} from "class-validator";
import {
  mantenimientosTipo,
  mantenimientosEstado,
} from "@model/tables/mantenimiento.model";
import type {
  MantenimientoTipo,
  MantenimientoEstado,
} from "@model/tables/mantenimiento.model";

export class MantenimientoPaginationQueryDto {
  @ApiProperty({
    description: "Número de página (comienza en 1)",
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
    description: "Cantidad de elementos por página",
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
    description:
      "Búsqueda por tipo, descripción o código de orden del mantenimiento",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: "Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD)",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiProperty({
    description: "Fecha de fin para filtrar por rango (formato: YYYY-MM-DD)",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiProperty({
    description: "Filtrar por tipo de mantenimiento",
    enum: mantenimientosTipo.enumValues,
    required: false,
  })
  @IsOptional()
  @IsIn(mantenimientosTipo.enumValues, { each: true })
  tipo?: MantenimientoTipo;

  @ApiProperty({
    description: "Filtrar por estado del mantenimiento",
    enum: mantenimientosEstado.enumValues,
    required: false,
  })
  @IsOptional()
  @IsIn(mantenimientosEstado.enumValues, { each: true })
  estado?: MantenimientoEstado;
}

export class PaginatedMantenimientoResultDto {
  @ApiProperty({
    description: "Lista de mantenimientos en la página actual",
    type: [MantenimientoResultDto],
  })
  data: MantenimientoResultDto[];

  @ApiProperty({
    description: "Metadatos de la paginación",
    example: {
      total: 50,
      page: 1,
      limit: 10,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: false,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
