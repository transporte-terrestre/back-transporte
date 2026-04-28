import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested, IsNotEmpty, IsInt, IsIn, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { vehiculoDocumentosTipo } from '@db/tables/vehiculo-documento.table';
import type { VehiculoDocumentoTipo } from '@db/tables/vehiculo-documento.table';

export class DocumentoVehiculoMasivoDetalleDto {
  @ApiProperty({ enum: vehiculoDocumentosTipo.enumValues })
  @IsIn(vehiculoDocumentosTipo.enumValues)
  @IsNotEmpty()
  tipo: VehiculoDocumentoTipo;

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

export class VehiculoDocumentoMasivoDto {
  @ApiProperty({ example: [1, 2, 3], required: false, description: 'IDs de vehículos a excluir' })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  excepto?: number[];

  @ApiProperty({ type: DocumentoVehiculoMasivoDetalleDto })
  @ValidateNested()
  @Type(() => DocumentoVehiculoMasivoDetalleDto)
  @IsNotEmpty()
  documento: DocumentoVehiculoMasivoDetalleDto;
}

export class VehiculoDocumentoMasivoResultDto {
  @ApiProperty({ example: 10, description: 'Número de vehículos a los que se asignó el documento' })
  count: number;

  @ApiProperty({ example: 'Documento asignado correctamente a 10 vehículos.', description: 'Mensaje de éxito' })
  message: string;
}
