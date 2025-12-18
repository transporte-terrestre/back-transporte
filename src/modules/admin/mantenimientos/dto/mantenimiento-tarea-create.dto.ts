import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
} from "class-validator";

export class MantenimientoTareaCreateDto {
  @ApiProperty({ example: 1, description: "ID del mantenimiento" })
  @IsNumber()
  @IsNotEmpty()
  mantenimientoId: number;

  @ApiProperty({
    example: "T-001",
    description: "Código de la tarea",
    required: false,
  })
  @IsOptional()
  @IsString()
  codigo?: string;

  @ApiProperty({
    example: "Mecánica",
    description: "Categoría de la tarea",
    required: false,
  })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({
    example: "Cambio de filtros",
    description: "Descripción de la tarea",
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    example: "Juan Perez",
    description: "Responsable",
    required: false,
  })
  @IsOptional()
  @IsString()
  responsable?: string;

  @ApiProperty({
    example: "08:00",
    description: "Hora de inicio",
    required: false,
  })
  @IsOptional()
  @IsString()
  horaInicio?: string;

  @ApiProperty({
    example: "10:00",
    description: "Hora de fin",
    required: false,
  })
  @IsOptional()
  @IsString()
  horaFin?: string;

  @ApiProperty({
    example: false,
    description: "Si la tarea está completada",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  completada?: boolean;

  @ApiProperty({
    example: "50.00",
    description: "Costo estimado",
    required: false,
  })
  @IsOptional()
  @IsString()
  costoEstimado?: string;

  @ApiProperty({ example: "55.00", description: "Costo real", required: false })
  @IsOptional()
  @IsString()
  costoReal?: string;

  @ApiProperty({
    example: "Ninguna",
    description: "Observaciones",
    required: false,
  })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
