import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsIn, IsString, IsDateString } from 'class-validator';
import { ConductorDocumentoDTO, conductorDocumentosTipo } from '@db/tables/conductor-documento.table';
import type { ConductorDocumentoTipo } from '@db/tables/conductor-documento.table';

export class ConductorDocumentoCreateDto implements Omit<ConductorDocumentoDTO, 'id' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 1, description: 'ID del conductor' })
  @IsInt()
  @IsNotEmpty()
  conductorId: number;

  @ApiProperty({
    enum: conductorDocumentosTipo.enumValues,
    description: 'Tipo de documento',
    default: conductorDocumentosTipo.enumValues[0],
  })
  @IsIn(conductorDocumentosTipo.enumValues, { each: true })
  @IsNotEmpty()
  tipo: ConductorDocumentoTipo;

  @ApiProperty({ example: 'Documento 1', description: 'Nombre del documento' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: 'https://storage.example.com/documentos/licencia-A123456.pdf',
    description: 'URL del documento',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Fecha de expiración del documento',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaExpiracion: string;

  @ApiProperty({
    example: '2023-01-15',
    description: 'Fecha de emisión del documento',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaEmision: string;
}
