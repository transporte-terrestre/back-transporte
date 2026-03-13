import { ApiProperty } from '@nestjs/swagger';
import { AlquilerDocumentoResultDto } from '../alquiler-documento/alquiler-documento-result.dto';
import { alquilerTipo, alquilerEstado } from '@db/tables/alquiler.table';
import type { AlquilerTipo, AlquilerEstado } from '@db/tables/alquiler.table';

export class AlquilerVehiculoDto {
  @ApiProperty() id: number;
  @ApiProperty() placa: string;
  @ApiProperty() marca: string;
  @ApiProperty() modelo: string;
}

export class AlquilerClienteDto {
  @ApiProperty() id: number;
  @ApiProperty() nombreCompleto: string;
}

export class AlquilerConductorDto {
  @ApiProperty() id: number;
  @ApiProperty() nombreCompleto: string;
  @ApiProperty({ required: false }) dni?: string | null;
}

export class AlquilerProveedorDto {
  @ApiProperty() id: number;
  @ApiProperty() nombreCompleto: string;
  @ApiProperty() dni: string;
  @ApiProperty({ required: false }) ruc?: string | null;
}

export class AlquilerResultDto {
  @ApiProperty() id: number;

  @ApiProperty() clienteId: number;
  @ApiProperty() vehiculoId: number;
  @ApiProperty({ required: false }) conductorId?: number | null;

  @ApiProperty({ enum: alquilerTipo.enumValues }) tipo: AlquilerTipo;

  @ApiProperty() kilometrajeInicial: number;
  @ApiProperty({ required: false }) kilometrajeFinal?: number | null;

  @ApiProperty() montoPorDia: number;
  @ApiProperty({ required: false }) montoTotalFinal?: number | null;
  @ApiProperty({ required: false }) razon?: string | null;

  @ApiProperty() fechaInicio: Date;
  @ApiProperty({ required: false }) fechaFin?: Date | null;

  @ApiProperty({ required: false }) monto?: string | null;
  @ApiProperty({ required: false }) observaciones?: string | null;
  @ApiProperty({ enum: alquilerEstado.enumValues }) estado: AlquilerEstado;

  @ApiProperty() creadoEn: Date;
  @ApiProperty() actualizadoEn: Date;

  @ApiProperty({ type: AlquilerClienteDto, required: false }) cliente?: AlquilerClienteDto;
  @ApiProperty({ type: AlquilerVehiculoDto, required: false }) vehiculo?: AlquilerVehiculoDto;
  @ApiProperty({ type: AlquilerConductorDto, required: false }) conductor?: AlquilerConductorDto;
  @ApiProperty({ type: AlquilerProveedorDto, required: false }) proveedor?: AlquilerProveedorDto;
  @ApiProperty({ type: [AlquilerDocumentoResultDto], required: false }) documentos?: AlquilerDocumentoResultDto[];
}
