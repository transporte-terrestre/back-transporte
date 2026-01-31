import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsIn, IsString, IsDateString, IsOptional } from 'class-validator';
import { ProveedorDocumentoDTO, proveedorDocumentosTipo } from '@db/tables/proveedor-documento.model';
import type { ProveedorDocumentoTipo } from '@db/tables/proveedor-documento.model';

export class ProveedorDocumentoCreateDto implements Omit<ProveedorDocumentoDTO, 'id' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 1, description: 'ID del proveedor' })
  @IsInt()
  @IsNotEmpty()
  proveedorId: number;

  @ApiProperty({
    description: 'Tipo de documento',
    enum: proveedorDocumentosTipo.enumValues,
    default: proveedorDocumentosTipo.enumValues[0],
  })
  @IsIn(proveedorDocumentosTipo.enumValues, { each: true })
  @IsNotEmpty()
  tipo: ProveedorDocumentoTipo;

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
