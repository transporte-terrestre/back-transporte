import { ApiProperty } from '@nestjs/swagger';
import { vehiculoChecklistDocumentViajeTipoEnum } from '@db/tables/vehiculo-checklist-document.table';
import type { VehiculoChecklistDocumentViajeTipo } from '@db/tables/vehiculo-checklist-document.table';

export class ResultHerramientaItemDto {
  @ApiProperty({ description: 'Etiqueta del item' })
  label: string;

  @ApiProperty({ description: 'Habilitada para uso (SI/NO)' })
  estado: boolean;

  @ApiProperty({ description: 'Stock actual', required: false })
  stock?: string;

  @ApiProperty({ description: 'A: Herramienta sin grasa impregnada', required: false })
  criterioA?: boolean;

  @ApiProperty({ description: 'B: Empalme y conexiones', required: false })
  criterioB?: boolean;

  @ApiProperty({ description: 'C: Almacenamiento adecuado', required: false })
  criterioC?: boolean;

  @ApiProperty({ description: 'D: Golpes y abolladuras', required: false })
  criterioD?: boolean;

  @ApiProperty({ description: 'E: Limpia y ordenada', required: false })
  criterioE?: boolean;

  @ApiProperty({ description: 'F: Otro', required: false })
  criterioF?: boolean;

  @ApiProperty({ description: 'Accion Correctiva', required: false })
  accionCorrectiva?: string;

  @ApiProperty({ description: 'Observación', required: false })
  observacion?: string;
}

export class HerramientasItemsDto {
  @ApiProperty({ type: ResultHerramientaItemDto }) llavesMixtas: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) destornilladorEstrella: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) destornilladorPlano: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) alicate: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) llaveRuedaPalanca: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) trianguloSeguridad: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) conosPeligro: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) cableCorriente: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) eslinga: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) grilletes: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) tacosCunas: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) linterna: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) extintor: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) pico: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) medidorAire: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) varasLuminosas: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) paletaPareSiga: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) escoba: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) balde: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) cuadernoBitacora: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) gataHidraulica: ResultHerramientaItemDto;
  @ApiProperty({ type: ResultHerramientaItemDto }) cajaHerramientas: ResultHerramientaItemDto;
}

export class HerramientasInfoDto {
  @ApiProperty({ example: 'HERRAMIENTA SIN GRASA IMPREGNADA' }) criterioA: string;
  @ApiProperty({ example: 'EMPALME Y CONECCIONES' }) criterioB: string;
  @ApiProperty({ example: 'ALMACENAMIENTO ADECUADO' }) criterioC: string;
  @ApiProperty({ example: 'GOLPES Y ABOLLADURAS' }) criterioD: string;
  @ApiProperty({ example: 'LIMPIA Y ORDENADA' }) criterioE: string;
  @ApiProperty({ example: 'OTRO' }) criterioF: string;
}

export class ResultInspeccionHerramientasDocumentDto {
  @ApiProperty({ type: HerramientasInfoDto })
  info: HerramientasInfoDto;

  @ApiProperty({ type: HerramientasItemsDto })
  herramientas: HerramientasItemsDto;
}

export class ResultInspeccionHerramientasDto {
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

  @ApiProperty({ type: ResultInspeccionHerramientasDocumentDto })
  document: ResultInspeccionHerramientasDocumentDto;
}
