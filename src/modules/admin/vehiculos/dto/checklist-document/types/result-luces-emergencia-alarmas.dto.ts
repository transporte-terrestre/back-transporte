import { ApiProperty } from '@nestjs/swagger';
import { vehiculoChecklistDocumentViajeTipoEnum } from '@db/tables/vehiculo-checklist-document.table';
import type { VehiculoChecklistDocumentViajeTipo } from '@db/tables/vehiculo-checklist-document.table';

export class ResultLucesItemDto {
  @ApiProperty({ description: 'Etiqueta del item' })
  label: string;

  @ApiProperty({ description: 'Estado del item (Operativo SI/NO)' })
  estado: boolean;

  @ApiProperty({ description: 'Observación o Acción Correctiva', required: false })
  observacion?: string;
}

export class ResultLucesEmergenciaAlarmasDocumentDto {
  @ApiProperty({ type: ResultLucesItemDto }) alarmaRetroceso: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) alarmaCinturon: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) claxon: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) lucesCabina: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) lucesSalon: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) lucesAltasDerecho: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) lucesAltasIzquierdo: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) lucesBajasDerecho: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) lucesBajasIzquierdo: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) lucesLateralesDerecho: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) lucesLateralesIzquierdo: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) lucesNeblineros: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) lucesEstacionamientoDerecho: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) lucesEstacionamientoIzquierdo: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) lucesDireccionalesDerecho: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) lucesDireccionalesIzquierdo: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) luzEstroboscopica: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) luzPertiga: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) pruebaRadio: ResultLucesItemDto;
  @ApiProperty({ type: ResultLucesItemDto }) botonPanico: ResultLucesItemDto;
}

export class ResultLucesEmergenciaAlarmasDto {
  @ApiProperty({ description: 'ID del Viaje (si aplica)', nullable: true, example: 1 })
  viajeId: number | null;

  @ApiProperty({ description: 'ID del Vehículo', example: 10 })
  vehiculoId: number;

  @ApiProperty({ description: 'Código de versión del checklist', example: 'v00001_002_0000000001_salida' })
  version: string;

  @ApiProperty({
    description: 'Tipo de viaje',
    enum: vehiculoChecklistDocumentViajeTipoEnum.enumValues,
    example: vehiculoChecklistDocumentViajeTipoEnum.enumValues[0],
    nullable: true,
  })
  viajeTipo: VehiculoChecklistDocumentViajeTipo | null;

  @ApiProperty({ type: ResultLucesEmergenciaAlarmasDocumentDto })
  document: ResultLucesEmergenciaAlarmasDocumentDto;
}
