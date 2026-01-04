import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProveedorDocumentoResultDto {
  @ApiProperty({ example: 1, description: 'ID del documento' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID del proveedor' })
  proveedorId: number;

  @ApiProperty({ example: 'RUC', description: 'Tipo de documento' })
  tipo: string;

  @ApiPropertyOptional({ example: '20123456789', description: 'Número del documento' })
  numero: string | null;

  @ApiPropertyOptional({
    example: '2023-01-15',
    description: 'Fecha de emisión del documento',
  })
  fechaEmision: string | null;

  @ApiPropertyOptional({
    example: '2025-12-31',
    description: 'Fecha de vencimiento del documento',
  })
  fechaVencimiento: string | null;

  @ApiProperty({
    example: ['https://storage.example.com/documentos/ruc.pdf'],
    description: 'URLs de los archivos del documento',
    type: [String],
  })
  archivos: string[];

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Fecha de creación',
  })
  creadoEn: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Fecha de actualización',
  })
  actualizadoEn: Date;

  @ApiPropertyOptional({
    example: null,
    description: 'Fecha de eliminación',
  })
  eliminadoEn: Date | null;
}
