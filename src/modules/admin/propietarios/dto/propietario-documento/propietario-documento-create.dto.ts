import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsIn, IsString, IsDateString, IsOptional } from 'class-validator';
import { PropietarioDocumentoDTO, propietarioDocumentosTipo } from '@db/tables/propietario-documento.table';
import type { PropietarioDocumentoTipo } from '@db/tables/propietario-documento.table';

export class PropietarioDocumentoCreateDto implements Omit<PropietarioDocumentoDTO, 'id' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 1, description: 'ID del propietario' })
  @IsInt()
  @IsNotEmpty()
  propietarioId: number;

  @ApiProperty({
    description: 'Tipo de documento',
    enum: propietarioDocumentosTipo.enumValues,
    default: propietarioDocumentosTipo.enumValues[0],
  })
  @IsIn(propietarioDocumentosTipo.enumValues, { each: true })
  @IsNotEmpty()
  tipo: PropietarioDocumentoTipo;

  @ApiProperty({ example: 'Documento 1', description: 'Nombre del documento' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: 'https://storage.example.com/documentos/dni-12345678.pdf',
    description: 'URL del documento',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

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
