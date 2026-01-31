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

  @ApiProperty({ example: 1, description: "ID de la tarea del catálogo" })
  @IsNumber()
  @IsNotEmpty()
  tareaId: number;

  @ApiProperty({
    example: "Juan Perez",
    description: "Responsable de la ejecución",
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
    example: "Ninguna",
    description: "Observaciones",
    required: false,
  })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
