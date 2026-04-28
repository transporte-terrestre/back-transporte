import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested, IsNotEmpty, IsInt, IsIn, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { conductorDocumentosTipo } from '@db/tables/conductor-documento.table';
import type { ConductorDocumentoTipo } from '@db/tables/conductor-documento.table';

export class DocumentoConductorMasivoDetalleDto {
  @ApiProperty({ enum: conductorDocumentosTipo.enumValues })
  @IsIn(conductorDocumentosTipo.enumValues)
  @IsNotEmpty()
  tipo: ConductorDocumentoTipo;

  @ApiProperty({ example: 'Documento 1' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'https://storage.example.com/documentos/soat-ABC123.pdf' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: '2025-12-31', required: false })
  @IsDateString()
  @IsOptional()
  fechaExpiracion?: string;

  @ApiProperty({ example: '2023-01-15', required: false })
  @IsDateString()
  @IsOptional()
  fechaEmision?: string;
}

export class ConductorDocumentoMasivoDto {
  @ApiProperty({ example: [1, 2, 3], required: false, description: 'IDs de conductores a excluir' })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  excepto?: number[];

  @ApiProperty({ type: DocumentoConductorMasivoDetalleDto })
  @ValidateNested()
  @Type(() => DocumentoConductorMasivoDetalleDto)
  @IsNotEmpty()
  documento: DocumentoConductorMasivoDetalleDto;
}

export class ConductorDocumentoMasivoResultDto {
  @ApiProperty({ example: 10, description: 'Número de conductores a los que se asignó el documento' })
  count: number;

  @ApiProperty({ example: 'Documento asignado correctamente a 10 conductores.', description: 'Mensaje de éxito' })
  message: string;
}
