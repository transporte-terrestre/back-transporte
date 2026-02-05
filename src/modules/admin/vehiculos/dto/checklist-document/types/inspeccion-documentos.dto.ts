import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested, IsString } from 'class-validator';

export class DocumentoItemDto {
  @ApiProperty({ description: 'Si el documento es requerido/habilitado', default: true })
  @IsBoolean()
  habilitado: boolean;

  @ApiPropertyOptional({ description: 'Observación inicial' })
  @IsOptional()
  @IsString()
  observacion?: string;

  @ApiPropertyOptional({ description: 'Fecha de Vencimiento Inicial/Por defecto' })
  @IsOptional()
  @IsString()
  fechaVencimiento?: string;
}

export class InspeccionDocumentosDto {
  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  soatVigente: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  tarjetaPropiedad: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  tarjetaCirculacion: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  polizaVigente: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  ctivVigente: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  hojasMsdsVehiculo: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  manualOperacion: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  @IsOptional()
  otroVehiculo: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  licenciaMtc: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  licenciaInterna: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  checkListDiario: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  iperc: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  pets: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  hojasMsdsConductor: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  mapaRiesgos: DocumentoItemDto;

  @ApiProperty({ type: DocumentoItemDto })
  @ValidateNested()
  @Type(() => DocumentoItemDto)
  @IsOptional()
  otroConductor: DocumentoItemDto;
}
