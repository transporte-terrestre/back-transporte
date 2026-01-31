import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsDateString, IsOptional } from 'class-validator';
import { conductorDocumentosTipo } from '@db/tables/conductor-documento.table';
import type { ConductorDocumentoTipo } from '@db/tables/conductor-documento.table';

export class ConductorDocumentoUpdateDto {
  @ApiProperty({
    enum: conductorDocumentosTipo.enumValues,
    description: 'Tipo de documento',
    default: conductorDocumentosTipo.enumValues[0],
    required: false,
  })
  @IsIn(conductorDocumentosTipo.enumValues, { each: true })
  @IsOptional()
  tipo?: ConductorDocumentoTipo;

  @ApiProperty({
    example: 'https://storage.example.com/documentos/licencia-A123456.pdf',
    description: 'URL del documento',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Fecha de expiración del documento',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaExpiracion?: string;

  @ApiProperty({
    example: '2023-01-15',
    description: 'Fecha de emisión del documento',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaEmision?: string;
}
