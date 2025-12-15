import {
  IsInt,
  IsIn,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ViajeDTO,
  viajesEstado,
  modalidadServicio,
} from "@model/tables/viaje.model";

export class ViajeCreateDto
  implements Omit<ViajeDTO, "id" | "creadoEn" | "actualizadoEn">
{
  @ApiPropertyOptional({ example: 1, description: "ID de la ruta programada" })
  @IsOptional()
  @IsInt()
  rutaId?: number;

  @ApiPropertyOptional({
    example: "Lima - Arequipa (Ocasional)",
    description: "Descripción de ruta ocasional",
  })
  @IsOptional()
  @IsString()
  rutaOcasional?: string;

  @ApiPropertyOptional({
    example: false,
    description: "Indica si es un viaje ocasional",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isOcasional?: boolean;

  @ApiProperty({ example: 1, description: "ID del cliente" })
  @IsInt()
  @IsNotEmpty()
  clienteId: number;

  @ApiPropertyOptional({
    example: ["Juan Pérez", "María García"],
    description: "Lista de tripulantes",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tripulantes?: string[];

  @ApiPropertyOptional({
    enum: modalidadServicio.enumValues,
    description: "Modalidad de servicio",
    default: modalidadServicio.enumValues[0],
  })
  @IsOptional()
  @IsIn(modalidadServicio.enumValues, { each: true })
  modalidadServicio?: (typeof modalidadServicio.enumValues)[number];

  @ApiProperty({
    example: "2025-01-01T10:00:00Z",
    description: "Departure date",
  })
  @IsDate()
  @Type(() => Date)
  fechaSalida: Date;

  @ApiPropertyOptional({
    example: "2025-01-01T18:00:00Z",
    description: "Arrival date",
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaLlegada: Date | null;

  @ApiPropertyOptional({
    enum: viajesEstado.enumValues,
    description: "Trip status",
    default: viajesEstado.enumValues[0],
  })
  @IsOptional()
  @IsIn(viajesEstado.enumValues, { each: true })
  estado: (typeof viajesEstado.enumValues)[number];
}
