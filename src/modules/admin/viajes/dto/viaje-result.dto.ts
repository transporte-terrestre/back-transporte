import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import {
  viajesEstado,
  modalidadServicio,
  viajesTipoRuta,
} from "@model/tables/viaje.model";
import { ConductorResultDto } from "../../conductores/dto/conductor-result.dto";
import { VehiculoResultDto } from "../../vehiculos/dto/vehiculo-result.dto";
import { ClienteResultDto } from "../../clientes/dto/cliente-result.dto";
import { viajeConductoresRol } from "@model/tables/viaje-conductor.model";
import { viajeVehiculosRol } from "@model/tables/viaje-vehiculo.model";
import type {
  ViajeModalidadServicio,
  ViajeEstado,
  ViajeTipoRuta,
} from "@model/tables/viaje.model";
import { ViajeComentarioResultDto } from "./viaje-comentario-result.dto";
import { RutaResultDto } from "@module/admin/rutas/dto/ruta-result.dto";

export class ViajeConductorDetalleDto extends OmitType(ConductorResultDto, [
  "documentos",
]) {
  @ApiProperty({ example: true, description: "Es conductor principal" })
  esPrincipal: boolean;

  @ApiProperty({
    enum: viajeConductoresRol.enumValues,
    example: viajeConductoresRol.enumValues[0],
    description: "Rol del conductor",
  })
  rol: string;
}

export class ViajeVehiculoDetalleDto extends OmitType(VehiculoResultDto, [
  "documentos",
]) {
  @ApiProperty({ example: true, description: "Es vehículo principal" })
  esPrincipal: boolean;

  @ApiProperty({
    enum: viajeVehiculosRol.enumValues,
    example: viajeVehiculosRol.enumValues[0],
    description: "Rol del vehículo",
  })
  rol: string;
}

export class ViajeComentarioDetalleDto extends ViajeComentarioResultDto {
  @ApiProperty({ example: "Juan Pérez", description: "Nombre del usuario" })
  usuarioNombreCompleto: string;
}

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
    example: viajesTipoRuta.enumValues[0],
    description: "Tipo de ruta",
  })
  tipoRuta: ViajeTipoRuta;

  @ApiPropertyOptional({
    example: "450.00",
    description: "Distancia estimada del viaje en km",
  })
  distanciaEstimada: string | null;

  @ApiPropertyOptional({
    example: "455.50",
    description: "Distancia real al final del viaje en km",
  })
  distanciaFinal: string | null;

  @ApiProperty({ example: 1, description: "ID del cliente" })
  clienteId: number;

  @ApiPropertyOptional({
    example: ["Juan Pérez", "María García"],
    description: "Lista de tripulantes",
  })
  tripulantes: string[];

  @ApiProperty({
    enum: modalidadServicio.enumValues,
    example: modalidadServicio.enumValues[0],
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

  @ApiPropertyOptional({ type: [ViajeConductorDetalleDto] })
  conductores?: ViajeConductorDetalleDto[];

  @ApiPropertyOptional({ type: [ViajeVehiculoDetalleDto] })
  vehiculos?: ViajeVehiculoDetalleDto[];

  @ApiPropertyOptional({ type: [ViajeComentarioDetalleDto] })
  comentarios?: ViajeComentarioDetalleDto[];

  @ApiPropertyOptional({
    type: OmitType(ClienteResultDto, ["documentos"]),
  })
  cliente?: Omit<ClienteResultDto, "documentos">;

  @ApiPropertyOptional({ type: RutaResultDto })
  ruta?: Omit<RutaResultDto, "documentos">;
}
