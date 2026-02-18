import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProveedorDocumentoResultDto } from '../proveedor-documento/proveedor-documento-result.dto';
import { proveedoresTipoDocumento } from '@db/tables/proveedor.table';
import type { ProveedorDocumentoTipo } from '@db/tables/proveedor-documento.table';
import type { ProveedorTipoDocumento } from '@db/tables/proveedor.table';

export class DocumentosAgrupadosProveedorDto implements Record<ProveedorDocumentoTipo, ProveedorDocumentoResultDto[]> {
  @ApiProperty({ type: [ProveedorDocumentoResultDto] })
  dni: ProveedorDocumentoResultDto[];

  @ApiProperty({ type: [ProveedorDocumentoResultDto] })
  ruc: ProveedorDocumentoResultDto[];

  @ApiProperty({ type: [ProveedorDocumentoResultDto] })
  contrato: ProveedorDocumentoResultDto[];

  @ApiProperty({ type: [ProveedorDocumentoResultDto] })
  otros: ProveedorDocumentoResultDto[];
}

export class ProveedorResultDto {
  @ApiProperty({ example: 1, description: 'ID del proveedor' })
  id: number;

  @ApiProperty({
    description: 'Tipo de documento',
    enum: proveedoresTipoDocumento.enumValues,
    example: proveedoresTipoDocumento.enumValues[0],
  })
  tipoDocumento: ProveedorTipoDocumento;

  @ApiProperty({ example: '12345678', description: 'DNI del proveedor' })
  dni: string | null;

  @ApiProperty({ example: '20123456789', description: 'RUC del proveedor' })
  ruc: string | null;

  @ApiProperty({ example: 'Juan Carlos', description: 'Nombres del proveedor' })
  nombres: string | null;

  @ApiProperty({
    example: 'Pérez García',
    description: 'Apellidos del proveedor',
  })
  apellidos: string | null;

  @ApiProperty({
    example: 'Empresa SAC',
    description: 'Razón Social del proveedor',
  })
  razonSocial: string | null;

  @ApiProperty({
    example: 'Juan Carlos Pérez García',
    description: 'Nombre completo del proveedor',
  })
  nombreCompleto: string;

  @ApiPropertyOptional({
    example: 'juan.perez@example.com',
    description: 'Email del proveedor',
  })
  email: string | null;

  @ApiPropertyOptional({
    example: '987654321',
    description: 'Teléfono del proveedor',
  })
  telefono: string | null;

  @ApiPropertyOptional({
    example: 'Av. Principal 123',
    description: 'Dirección del proveedor',
  })
  direccion: string | null;

  @ApiProperty({
    example: ['https://res.cloudinary.com/xxx/image.jpg'],
    description: 'Lista de URLs de imágenes del proveedor',
    type: [String],
  })
  imagenes: string[];

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

  @ApiProperty({ description: 'Proveedor documents grouped by type' })
  documentos: DocumentosAgrupadosProveedorDto;
}
