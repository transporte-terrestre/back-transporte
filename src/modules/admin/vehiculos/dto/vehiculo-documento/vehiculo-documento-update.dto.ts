import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsDateString, IsOptional } from 'class-validator';
import { vehiculoDocumentosTipo } from '@db/tables/vehiculo-documento.table';
import type { VehiculoDocumentoTipo } from '@db/tables/vehiculo-documento.table';

export class VehiculoDocumentoUpdateDto {
  @ApiProperty({
    enum: vehiculoDocumentosTipo.enumValues,
    description: 'Tipo de documento',
    default: vehiculoDocumentosTipo.enumValues[0],
    required: false,
  })
  @IsIn(vehiculoDocumentosTipo.enumValues, { each: true })
  @IsOptional()
  tipo?: VehiculoDocumentoTipo;

  @ApiProperty({
    example: 'https://storage.example.com/documentos/soat-ABC123.pdf',
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
