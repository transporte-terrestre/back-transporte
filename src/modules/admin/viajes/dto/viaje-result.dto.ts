import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  viajesEstado,
  modalidadServicio,
  viajesTipoRuta,
} from "@model/tables/viaje.model";
import type {
  ViajeModalidadServicio,
  ViajeEstado,
  ViajeTipoRuta,
} from "@model/tables/viaje.model";

export class ViajeResultDto {
  @ApiProperty({ example: 1, description: "Trip ID" })
  id: number;

  @ApiPropertyOptional({ example: 1, description: "ID de la ruta programada" })
  rutaId: number | null;

  @ApiPropertyOptional({
    example: "Lima - Arequipa (Ocasional)",
    description: "Descripción de ruta ocasional",
  })
  rutaOcasional: string | null;

  @ApiProperty({
    enum: viajesTipoRuta.enumValues,
    example: "fija",
    description: "Tipo de ruta",
  })
  tipoRuta: ViajeTipoRuta;

  @ApiProperty({ example: 1, description: "ID del cliente" })
  clienteId: number;

  @ApiPropertyOptional({
    example: ["Juan Pérez", "María García"],
    description: "Lista de tripulantes",
  })
  tripulantes: string[];

  @ApiProperty({
    enum: modalidadServicio.enumValues,
    example: "regular",
    description: "Modalidad de servicio",
  })
  modalidadServicio: ViajeModalidadServicio;

  @ApiProperty({
    enum: viajesEstado.enumValues,
    example: viajesEstado.enumValues[0],
    description: "Trip status",
  })
  estado: ViajeEstado;

  @ApiProperty({
    example: "2025-01-01T10:00:00Z",
    description: "Departure date",
  })
  fechaSalida: Date;

  @ApiPropertyOptional({
    example: "2025-01-01T18:00:00Z",
    description: "Arrival date",
  })
  fechaLlegada: Date | null;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Creation date",
  })
  creadoEn: Date;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Update date",
  })
  actualizadoEn: Date;
}
