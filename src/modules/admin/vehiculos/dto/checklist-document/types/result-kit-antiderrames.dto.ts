import { ApiProperty } from '@nestjs/swagger';

export class ResultKitItemDto {
  @ApiProperty({ description: 'Etiqueta del item' })
  label: string;

  @ApiProperty({ description: 'Estado (SI/NO)' })
  estado: boolean;
}

export class ResultKitDocumentDto {
  @ApiProperty({ type: ResultKitItemDto }) mazoGoma: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) setCunas: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) bandeja: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) barrerasOleofilicas: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) cintaRoja: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) cintaAmarilla: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) bolsasRojas: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) panosOleofilicos: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) recogedorPlastico: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) manualContingencia: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) guantesNitrilo: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) lenteSeguridad: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) respirador: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) trajeTyvek: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) botasPVC: ResultKitItemDto;
  @ApiProperty({ type: ResultKitItemDto }) maletin: ResultKitItemDto;

  @ApiProperty({ description: 'Ubicación del Kit', example: 'Bodega Lateral' })
  ubicacion: string;
}

export class ResultKitAntiderramesDto {
  @ApiProperty({ description: 'ID del Viaje (si aplica)', nullable: true, example: 1 })
  viajeId: number | null;

  @ApiProperty({ description: 'ID del Vehículo', example: 10 })
  vehiculoId: number;

  @ApiProperty({ description: 'Código de versión del checklist', example: 'v00001_002_0000000001' })
  version: string;

  @ApiProperty({ type: ResultKitDocumentDto })
  document: ResultKitDocumentDto;
}
