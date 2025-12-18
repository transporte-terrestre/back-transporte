import { ApiProperty } from "@nestjs/swagger";
import { UsuarioListDto } from "./usuario-list.dto";
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
import { usuariosRol } from "@model/tables/usuario.model";
import type { UsuarioRol } from "@model/tables/usuario.model";

export class UsuarioPaginationQueryDto {
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
    description: "Búsqueda por nombre, apellido o email del usuario",
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
    description: "Filtrar por rol de usuario",
    enum: usuariosRol.enumValues,
    example: usuariosRol.enumValues[0],
    required: false,
  })
  @IsOptional()
  @IsIn(usuariosRol.enumValues, { each: true })
  rol?: UsuarioRol;
}

export class PaginatedUsuarioResultDto {
  @ApiProperty({
    description: "Lista de usuarios en la página actual",
    type: [UsuarioListDto],
  })
  data: UsuarioListDto[];

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
