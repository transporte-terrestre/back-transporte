import { ApiProperty } from '@nestjs/swagger';

export class PhotoResultDto {
  @ApiProperty({ description: 'URL de la imagen', example: 'https://image-document.jpg' })
  url: string;
}

export class ResultRevisionDocumentDto {
  @ApiProperty({ description: 'Datos de la foto', type: PhotoResultDto })
  photo: PhotoResultDto;
}

export class ResultRevisionVehiculosDto {
  @ApiProperty()
  viajeId: number | null;

  @ApiProperty()
  vehiculoId: number;

  @ApiProperty()
  version: string | null;

  @ApiProperty({ type: ResultRevisionDocumentDto })
  document: ResultRevisionDocumentDto;
}
