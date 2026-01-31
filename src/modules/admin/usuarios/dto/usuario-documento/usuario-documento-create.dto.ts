import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsIn, IsString, IsDateString, IsOptional } from 'class-validator';
import { UsuarioDocumentoDTO, usuarioDocumentosTipo } from '@db/tables/usuario-documento.table';
import type { UsuarioDocumentoTipo } from '@db/tables/usuario-documento.table';

export class UsuarioDocumentoCreateDto implements Omit<UsuarioDocumentoDTO, 'id' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({
    enum: usuarioDocumentosTipo.enumValues,
    description: 'Tipo de documento',
    default: usuarioDocumentosTipo.enumValues[0],
  })
  @IsIn(usuarioDocumentosTipo.enumValues, { each: true })
  @IsNotEmpty()
  tipo: UsuarioDocumentoTipo;

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
