import { ApiProperty } from "@nestjs/swagger";
import { VehiculoConductorResultDto } from "./vehiculo-conductor-result.dto";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Min, Max, IsDateString } from "class-validator";

export class VehiculoConductorPaginationQueryDto {
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
}

export class PaginatedVehiculoConductorResultDto {
  @ApiProperty({
    description: "Lista de asignaciones vehículo-conductor en la página actual",
    type: [VehiculoConductorResultDto],
  })
  data: VehiculoConductorResultDto[];

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
