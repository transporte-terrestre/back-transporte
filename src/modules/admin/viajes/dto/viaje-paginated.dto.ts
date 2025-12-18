import { ApiProperty } from "@nestjs/swagger";
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
  modalidadServicio,
  viajesTipoRuta,
  viajesEstado,
} from "@model/tables/viaje.model";
import type {
  ViajeModalidadServicio,
  ViajeTipoRuta,
  ViajeEstado,
} from "@model/tables/viaje.model";
import { ViajeListDto } from "./viaje-list.dto";

export class ViajePaginationQueryDto {
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
    description: "Búsqueda por ruta ocasional",
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
    description: "Filtrar por modalidad de servicio",
    enum: modalidadServicio.enumValues,
    example: modalidadServicio.enumValues[0],
    required: false,
  })
  @IsOptional()
  @IsIn(modalidadServicio.enumValues, { each: true })
  modalidadServicio?: ViajeModalidadServicio;

  @ApiProperty({
    description: "Filtrar por tipo de ruta (ocasional, fija)",
    enum: viajesTipoRuta.enumValues,
    example: viajesTipoRuta.enumValues[0],
    required: false,
  })
  @IsOptional()
  @IsIn(viajesTipoRuta.enumValues, { each: true })
  tipoRuta?: ViajeTipoRuta;

  @ApiProperty({
    description: "Filtrar por estado del viaje",
    enum: viajesEstado.enumValues,
    example: viajesEstado.enumValues[0],
    required: false,
  })
  @IsOptional()
  @IsIn(viajesEstado.enumValues, { each: true })
  estado?: ViajeEstado;
}

export class PaginatedViajeResultDto {
  @ApiProperty({
    description: "Lista de viajes en la página actual",
    type: [ViajeListDto],
  })
  data: ViajeListDto[];

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
