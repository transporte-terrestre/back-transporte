import {
  IsInt,
  IsIn,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsString,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ViajeDTO,
  viajesEstado,
  modalidadServicio,
  viajesTipoRuta,
} from "@model/tables/viaje.model";
import type {
  ViajeEstado,
  ViajeModalidadServicio,
  ViajeTipoRuta,
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
    enum: viajesTipoRuta.enumValues,
    description: "Tipo de ruta (fija, ocasional)",
    default: viajesTipoRuta.enumValues[1],
  })
  @IsOptional()
  @IsIn(viajesTipoRuta.enumValues, { each: true })
  tipoRuta: ViajeTipoRuta;

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
  modalidadServicio?: ViajeModalidadServicio;

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
  estado: ViajeEstado;

  @ApiPropertyOptional({
    example: 1,
    description: "ID del conductor principal",
  })
  @IsOptional()
  @IsInt()
  conductorId?: number;

  @ApiPropertyOptional({ example: 1, description: "ID del vehículo principal" })
  @IsOptional()
  @IsInt()
  vehiculoId?: number;
}
