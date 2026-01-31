import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropietarioDocumentoDTO, propietarioDocumentosTipo } from '@db/tables/propietario-documento.model';
import type { PropietarioDocumentoTipo } from '@db/tables/propietario-documento.model';

export class PropietarioDocumentoResultDto implements PropietarioDocumentoDTO {
  @ApiProperty({ example: 1, description: 'ID del documento' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID del propietario' })
  propietarioId: number;

  @ApiProperty({
    enum: propietarioDocumentosTipo.enumValues,
    example: 'contrato',
    description: 'Tipo de documento',
  })
  tipo: PropietarioDocumentoTipo;

  @ApiProperty({ example: 'Contrato de Propietario', description: 'Nombre del documento' })
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
