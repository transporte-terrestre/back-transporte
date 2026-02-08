import { ApiProperty } from '@nestjs/swagger';
import { vehiculoChecklistDocumentViajeTipoEnum } from '@db/tables/vehiculo-checklist-document.table';
import type { VehiculoChecklistDocumentViajeTipo } from '@db/tables/vehiculo-checklist-document.table';

export class PhotoResultDto {
  @ApiProperty({ description: 'URL de la imagen', example: 'https://image-document.jpg' })
  url: string;
}

export class ResultIpercDocumentDto {
  @ApiProperty({ description: 'Datos de la foto', type: PhotoResultDto })
  photo: PhotoResultDto;
}

export class ResultIpercContinuoDto {
  @ApiProperty()
  viajeId: number | null;

  @ApiProperty()
  vehiculoId: number;

  @ApiProperty({ description: 'Código de versión', example: 'v00001_002_0000000001_salida', nullable: true })
  version: string | null;

  @ApiProperty({
    description: 'Tipo de viaje',
    enum: vehiculoChecklistDocumentViajeTipoEnum.enumValues,
    example: vehiculoChecklistDocumentViajeTipoEnum.enumValues[0],
    nullable: true,
  })
  viajeTipo: VehiculoChecklistDocumentViajeTipo | null;

  @ApiProperty({ type: ResultIpercDocumentDto })
  document: ResultIpercDocumentDto;
}
