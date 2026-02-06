import { ApiProperty } from '@nestjs/swagger';

export class ResultBotiquinItemDto {
  @ApiProperty({ description: 'Etiqueta del item' })
  label: string;

  @ApiProperty({ description: 'Habilitado/Existente (SI/NO)', required: false })
  habilitado: boolean;

  @ApiProperty({ description: 'Fecha de Vencimiento', required: false })
  fechaVencimiento?: string;

  @ApiProperty({ description: 'Fecha de Salida', required: false })
  fechaSalida?: string;

  @ApiProperty({ description: 'Fecha de reposición', required: false })
  fechaReposicion?: string;
}

export class ResultInspeccionBotiquinesDocumentDto {
  @ApiProperty({ type: ResultBotiquinItemDto }) alcohol: ResultBotiquinItemDto;
  @ApiProperty({ type: ResultBotiquinItemDto }) jabonLiquido: ResultBotiquinItemDto;
  @ApiProperty({ type: ResultBotiquinItemDto }) gasaEsterilizada: ResultBotiquinItemDto;
  @ApiProperty({ type: ResultBotiquinItemDto }) apositoEsterilizado: ResultBotiquinItemDto;
  @ApiProperty({ type: ResultBotiquinItemDto }) esparadrapo: ResultBotiquinItemDto;
  @ApiProperty({ type: ResultBotiquinItemDto }) vendaElastica: ResultBotiquinItemDto;
  @ApiProperty({ type: ResultBotiquinItemDto }) banditasAdhesivas: ResultBotiquinItemDto;
  @ApiProperty({ type: ResultBotiquinItemDto }) tijeraPuntaRoma: ResultBotiquinItemDto;
  @ApiProperty({ type: ResultBotiquinItemDto }) guantesQuirurgicos: ResultBotiquinItemDto;
  @ApiProperty({ type: ResultBotiquinItemDto }) algodon: ResultBotiquinItemDto;
  @ApiProperty({ type: ResultBotiquinItemDto }) maletin: ResultBotiquinItemDto;

  @ApiProperty({ description: 'Ubicación del Botiquín', example: 'Cabina del conductor' })
  ubicacionBotiquin: string;
}

export class ResultInspeccionBotiquinesDto {
  @ApiProperty({ description: 'ID del Viaje (si aplica)', nullable: true, example: 1 })
  viajeId: number | null;

  @ApiProperty({ description: 'ID del Vehículo', example: 10 })
  vehiculoId: number;

  @ApiProperty({ description: 'Código de versión del checklist', example: 'v00001_002_0000000001' })
  version: string;

  @ApiProperty({ type: ResultInspeccionBotiquinesDocumentDto })
  document: ResultInspeccionBotiquinesDocumentDto;
}
