import { ApiProperty } from "@nestjs/swagger";
import { ViajeResultDto } from "./viaje-result.dto";
import { Type } from "class-transformer";
import {
  IsInt,
  IsOptional,
  Min,
  Max,
  IsString,
  IsDateString,
  IsBoolean,
  IsIn,
} from "class-validator";
import { modalidadServicio } from "@model/tables/viaje.model";

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
    description: "Búsqueda por estado del viaje",
    example: "programado",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: "Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD)",
    example: "2024-01-01",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiProperty({
    description: "Fecha de fin para filtrar por rango (formato: YYYY-MM-DD)",
    example: "2024-12-31",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiProperty({
    description: "Filtrar por modalidad de servicio",
    enum: modalidadServicio.enumValues,
    default: modalidadServicio.enumValues[0],
    required: false,
  })
  @IsOptional()
  @IsIn(modalidadServicio.enumValues, { each: true })
  modalidadServicio?: string;

  @ApiProperty({
    description: "Filtrar por viajes ocasionales o regulares",
    example: false,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isOcasional?: boolean;
}

export class PaginatedViajeResultDto {
  @ApiProperty({
    description: "Lista de viajes en la página actual",
    type: [ViajeResultDto],
  })
  data: ViajeResultDto[];

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
