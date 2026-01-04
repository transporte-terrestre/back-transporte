import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProveedorDocumentoDTO, proveedorDocumentosTipo } from '@model/tables/proveedor-documento.model';
import type { ProveedorDocumentoTipo } from '@model/tables/proveedor-documento.model';

export class ProveedorDocumentoResultDto implements ProveedorDocumentoDTO {
  @ApiProperty({ example: 1, description: 'ID del documento' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID del proveedor' })
  proveedorId: number;

  @ApiProperty({
    enum: proveedorDocumentosTipo.enumValues,
    example: 'contrato',
    description: 'Tipo de documento',
  })
  tipo: ProveedorDocumentoTipo;

  @ApiProperty({ example: 'Contrato de Proveedor', description: 'Nombre del documento' })
  nombre: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/xxx/doc.pdf', description: 'URL del documento' })
  url: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Fecha de expiración (YYYY-MM-DD)' })
  fechaExpiracion: string | null;

  @ApiPropertyOptional({ example: '2023-01-01', description: 'Fecha de emisión (YYYY-MM-DD)' })
  fechaEmision: string | null;

  @ApiProperty({ description: 'Fecha de creación' })
  creadoEn: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  actualizadoEn: Date;
}
