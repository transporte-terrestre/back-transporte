import { ApiProperty } from '@nestjs/swagger';
import { vehiculoChecklistDocumentViajeTipoEnum } from '@db/tables/vehiculo-checklist-document.table';
import type { VehiculoChecklistDocumentViajeTipo } from '@db/tables/vehiculo-checklist-document.table';

export class ResultCinturonItemDto {
  @ApiProperty({ description: 'Etiqueta del item' })
  label: string;

  @ApiProperty({ description: 'Si el asiento existe/está habilitado' })
  habilitado: boolean;

  @ApiProperty({ description: 'Observación inicial o configuración', required: false })
  observacion?: string;
}

export class ResultCinturonesDocumentDto {
  @ApiProperty({ type: ResultCinturonItemDto }) asientoPiloto: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asientoCopiloto: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento1: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento2: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento3: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento4: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento5: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento6: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento7: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento8: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento9: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento10: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento11: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento12: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento13: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento14: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento15: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento16: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento17: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento18: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento19: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento20: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento21: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento22: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento23: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento24: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento25: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento26: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento27: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento28: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento29: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento30: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento31: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento32: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento33: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento34: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento35: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento36: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento37: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento38: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento39: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento40: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento41: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento42: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento43: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento44: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento45: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento46: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento47: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento48: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento49: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento50: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento51: ResultCinturonItemDto;
  @ApiProperty({ type: ResultCinturonItemDto }) asiento52: ResultCinturonItemDto;
}

export class ResultCinturonesSeguridadDto {
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

  @ApiProperty({ type: ResultCinturonesDocumentDto })
  document: ResultCinturonesDocumentDto;
}
