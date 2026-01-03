import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsString, IsOptional, IsArray } from 'class-validator';
import { ProveedorDocumentoDTO } from '@model/tables/proveedor-documento.model';

export class ProveedorDocumentoCreateDto implements Omit<ProveedorDocumentoDTO, 'id' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 1, description: 'ID del proveedor' })
  @IsInt()
  @IsNotEmpty()
  proveedorId: number;

  @ApiProperty({ example: 'RUC', description: 'Tipo de documento' })
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @ApiProperty({ example: '20123456789', description: 'Número del documento', required: false })
  @IsString()
  @IsOptional()
  numero?: string | null;

  @ApiProperty({
    example: '2023-01-15',
    description: 'Fecha de emisión del documento',
    required: false,
  })
  @IsString()
  @IsOptional()
  fechaEmision?: string | null;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Fecha de vencimiento del documento',
    required: false,
  })
  @IsString()
  @IsOptional()
  fechaVencimiento?: string | null;

  @ApiProperty({
    example: ['https://storage.example.com/documentos/ruc.pdf'],
    description: 'URLs de los archivos del documento',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  archivos?: string[];
}
