import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { mantenimientoDocumentosTipo, MantenimientoDocumentoDTO } from '@db/tables/mantenimiento-documento.model';
import type { MantenimientoDocumentoTipo } from '@db/tables/mantenimiento-documento.model';

export class MantenimientoDocumentoCreateDto implements Omit<MantenimientoDocumentoDTO, 'id' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 1, description: 'ID del mantenimiento' })
  @IsInt()
  @IsNotEmpty()
  mantenimientoId: number;

  @ApiProperty({
    enum: mantenimientoDocumentosTipo.enumValues,
    example: mantenimientoDocumentosTipo.enumValues[0],
    description: 'Tipo de documento',
  })
  @IsEnum(mantenimientoDocumentosTipo.enumValues)
  @IsNotEmpty()
  tipo: MantenimientoDocumentoTipo;

  @ApiProperty({ example: 'Factura 001', description: 'Nombre del documento' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: 'https://example.com/doc.pdf',
    description: 'URL del documento',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: '2023-01-15',
    description: 'Fecha de emisión del documento',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaEmision?: string;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Fecha de expiración del documento',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaExpiracion?: string;
}
