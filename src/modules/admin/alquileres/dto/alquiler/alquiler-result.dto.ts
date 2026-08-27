import { ApiProperty } from '@nestjs/swagger';
import { AlquilerDocumentoResultDto } from '../alquiler-documento/alquiler-documento-result.dto';
import { alquilerTipo, alquilerEstado, alquilerMoneda } from '@db/tables/alquiler.table';
import type { AlquilerTipo, AlquilerEstado, AlquilerMoneda } from '@db/tables/alquiler.table';
import type { AlquilerDocumentoTipo } from '@db/tables/alquiler-documento.table';

export class AlquilerVehiculoDto {
  @ApiProperty() id: number;
  @ApiProperty() placa: string;
  @ApiProperty() marca: string;
  @ApiProperty() modelo: string;
  @ApiProperty({ required: false }) foto?: string | null;
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

export class AlquilerDetalleResultDto {
  @ApiProperty() id: number;
  @ApiProperty() alquilerId: number;
  @ApiProperty() vehiculoId: number;
  @ApiProperty({ required: false }) conductorId?: number | null;
  @ApiProperty({ enum: alquilerTipo.enumValues }) tipo: AlquilerTipo;
  @ApiProperty() kilometrajeInicial: number;
  @ApiProperty({ required: false }) kilometrajeFinal?: number | null;
  @ApiProperty({ type: AlquilerVehiculoDto, required: false }) vehiculo?: AlquilerVehiculoDto;
  @ApiProperty({ type: AlquilerConductorDto, required: false }) conductor?: AlquilerConductorDto;
}

export class AlquilerHistorialResultDto {
  @ApiProperty() id: number;
  @ApiProperty() alquilerId: number;
  @ApiProperty({ required: false }) vehiculoId?: number | null;
  @ApiProperty() tipoAccion: string;
  @ApiProperty({ required: false }) montoAnterior?: number | null;
  @ApiProperty({ required: false }) montoNuevo?: number | null;
  @ApiProperty({ required: false }) motivo?: string | null;
  @ApiProperty() fechaAccion: Date;
  @ApiProperty({ type: AlquilerVehiculoDto, required: false }) vehiculo?: Partial<AlquilerVehiculoDto>;
}

export class DocumentosAgrupadosAlquilerDto implements Record<AlquilerDocumentoTipo, AlquilerDocumentoResultDto[]> {
  @ApiProperty({ type: [AlquilerDocumentoResultDto] })
  contrato: AlquilerDocumentoResultDto[];

  @ApiProperty({ type: [AlquilerDocumentoResultDto] })
  documentacion: AlquilerDocumentoResultDto[];

  @ApiProperty({ type: [AlquilerDocumentoResultDto] })
  guia_remision: AlquilerDocumentoResultDto[];

  @ApiProperty({ type: [AlquilerDocumentoResultDto] })
  acta_entrega: AlquilerDocumentoResultDto[];

  @ApiProperty({ type: [AlquilerDocumentoResultDto] })
  acta_devolucion: AlquilerDocumentoResultDto[];

  @ApiProperty({ type: [AlquilerDocumentoResultDto] })
  comprobante_pago: AlquilerDocumentoResultDto[];

  @ApiProperty({ type: [AlquilerDocumentoResultDto] })
  otros: AlquilerDocumentoResultDto[];
}

export class AlquilerResultDto {
  @ApiProperty() id: number;

  @ApiProperty() clienteId: number;

  @ApiProperty() montoPorDia: number;
  @ApiProperty({ required: false }) montoTotalFinal?: number | null;
  @ApiProperty({ enum: alquilerMoneda.enumValues, example: 'PEN' }) moneda: AlquilerMoneda;
  @ApiProperty({ required: false }) razon?: string | null;

  @ApiProperty() fechaInicio: Date;
  @ApiProperty({ required: false }) fechaFin?: Date | null;
  @ApiProperty() esIndefinido: boolean;

  @ApiProperty({ required: false }) observaciones?: string | null;
  @ApiProperty({ enum: alquilerEstado.enumValues }) estado: AlquilerEstado;

  @ApiProperty() creadoEn: Date;
  @ApiProperty() actualizadoEn: Date;

  @ApiProperty({ type: AlquilerClienteDto, required: false }) cliente?: AlquilerClienteDto;
  @ApiProperty({ type: [AlquilerDetalleResultDto], required: false }) detalles?: AlquilerDetalleResultDto[];
  @ApiProperty({ type: [AlquilerHistorialResultDto], required: false }) historial?: AlquilerHistorialResultDto[];
  @ApiProperty({ type: DocumentosAgrupadosAlquilerDto, required: false }) documentos?: DocumentosAgrupadosAlquilerDto;
}
