import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropietarioDocumentoResultDto } from './propietario-documento-result.dto';
import { propietariosTipoDocumento } from '@db/tables/propietario.table';
import type { PropietarioDocumentoTipo } from '@db/tables/propietario-documento.table';
import type { PropietarioTipoDocumento } from '@db/tables/propietario.table';

export class DocumentosAgrupadosPropietarioDto implements Record<PropietarioDocumentoTipo, PropietarioDocumentoResultDto[]> {
  @ApiProperty({ type: [PropietarioDocumentoResultDto] })
  dni: PropietarioDocumentoResultDto[];

  @ApiProperty({ type: [PropietarioDocumentoResultDto] })
  ruc: PropietarioDocumentoResultDto[];

  @ApiProperty({ type: [PropietarioDocumentoResultDto] })
  contrato: PropietarioDocumentoResultDto[];

  @ApiProperty({ type: [PropietarioDocumentoResultDto] })
  otros: PropietarioDocumentoResultDto[];
}

export class PropietarioResultDto {
  @ApiProperty({ example: 1, description: 'ID del propietario' })
  id: number;

  @ApiProperty({
    description: 'Tipo de documento',
    enum: propietariosTipoDocumento.enumValues,
    example: propietariosTipoDocumento.enumValues[0],
  })
  tipoDocumento: PropietarioTipoDocumento;

  @ApiProperty({ example: '12345678', description: 'DNI del propietario' })
  dni: string | null;

  @ApiProperty({ example: '20123456789', description: 'RUC del propietario' })
  ruc: string | null;

  @ApiProperty({ example: 'Juan Carlos', description: 'Nombres del propietario' })
  nombres: string | null;

  @ApiProperty({
    example: 'Pérez García',
    description: 'Apellidos del propietario',
  })
  apellidos: string | null;

  @ApiProperty({
    example: 'Empresa SAC',
    description: 'Razón Social del propietario',
  })
  razonSocial: string | null;

  @ApiProperty({
    example: 'Juan Carlos Pérez García',
    description: 'Nombre completo del propietario',
  })
  nombreCompleto: string;

  @ApiPropertyOptional({
    example: 'juan.perez@example.com',
    description: 'Email del propietario',
  })
  email: string | null;

  @ApiPropertyOptional({
    example: '987654321',
    description: 'Teléfono del propietario',
  })
  telefono: string | null;

  @ApiPropertyOptional({
    example: 'Av. Principal 123',
    description: 'Dirección del propietario',
  })
  direccion: string | null;

  @ApiProperty({
    example: ['https://res.cloudinary.com/xxx/image.jpg'],
    description: 'Lista de URLs de imágenes del propietario',
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

  @ApiProperty({ description: 'Propietario documents grouped by type' })
  documentos: DocumentosAgrupadosPropietarioDto;
}
