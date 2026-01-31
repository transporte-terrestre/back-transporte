import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsDateString, IsOptional } from 'class-validator';
import { usuarioDocumentosTipo } from '@db/tables/usuario-documento.table';
import type { UsuarioDocumentoTipo } from '@db/tables/usuario-documento.table';

export class UsuarioDocumentoUpdateDto {
  @ApiProperty({
    enum: usuarioDocumentosTipo.enumValues,
    description: 'Tipo de documento',
    default: usuarioDocumentosTipo.enumValues[0],
    required: false,
  })
  @IsIn(usuarioDocumentosTipo.enumValues, { each: true })
  @IsOptional()
  tipo?: UsuarioDocumentoTipo;

  @ApiProperty({
    example: 'https://storage.example.com/documentos/dni-12345678.pdf',
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
