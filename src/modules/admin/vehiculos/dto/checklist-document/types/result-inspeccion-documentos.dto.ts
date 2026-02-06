import { ApiProperty } from '@nestjs/swagger';

export class ResultDocumentoItemDto {
  @ApiProperty({ description: 'Etiqueta del item' })
  label: string;

  @ApiProperty({ description: 'Si el documento es requerido/habilitado' })
  habilitado: boolean;

  @ApiProperty({ description: 'Observación inicial', required: false })
  observacion?: string;

  @ApiProperty({ description: 'Fecha de Vencimiento Inicial/Por defecto', required: false })
  fechaVencimiento?: string;
}

// 1. Documentos del Vehiculo
export class DocumentosVehiculoItemsDto {
  @ApiProperty({ type: ResultDocumentoItemDto }) soatVigente: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) tarjetaPropiedad: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) tarjetaCirculacion: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) polizaVigente: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) ctivVigente: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) hojasMsdsVehiculo: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) manualOperacion: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) otroVehiculo: ResultDocumentoItemDto;
}
export class DocumentosVehiculoSectionDto {
  @ApiProperty({ description: 'Título de la sección' }) label: string;
  @ApiProperty({ type: DocumentosVehiculoItemsDto }) items: DocumentosVehiculoItemsDto;
}

// 2. Documentos del Conductor
export class DocumentosConductorItemsDto {
  @ApiProperty({ type: ResultDocumentoItemDto }) licenciaMtc: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) licenciaInterna: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) checkListDiario: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) iperc: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) pets: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) hojasMsdsConductor: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) mapaRiesgos: ResultDocumentoItemDto;
  @ApiProperty({ type: ResultDocumentoItemDto }) otroConductor: ResultDocumentoItemDto;
}
export class DocumentosConductorSectionDto {
  @ApiProperty({ description: 'Título de la sección' }) label: string;
  @ApiProperty({ type: DocumentosConductorItemsDto }) items: DocumentosConductorItemsDto;
}

// Document
export class ResultInspeccionDocumentosDocumentDto {
  @ApiProperty({ type: DocumentosVehiculoSectionDto }) documentosVehiculo: DocumentosVehiculoSectionDto;
  @ApiProperty({ type: DocumentosConductorSectionDto }) documentosConductor: DocumentosConductorSectionDto;
}

export class ResultInspeccionDocumentosDto {
  @ApiProperty({ description: 'ID del Viaje (si aplica)', nullable: true, example: 1 })
  viajeId: number | null;

  @ApiProperty({ description: 'ID del Vehículo', example: 10 })
  vehiculoId: number;

  @ApiProperty({ description: 'Código de versión del checklist', example: 'v00001_002_0000000001' })
  version: string;

  @ApiProperty({ type: ResultInspeccionDocumentosDocumentDto })
  document: ResultInspeccionDocumentosDocumentDto;
}
