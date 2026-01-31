import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { conductoresClaseLicencia, conductoresCategoriaLicencia } from '@db/tables/conductor.table';
import { ConductorDocumentoResultDto } from '../conductor-documento/conductor-documento-result.dto';
import type { ConductorClaseLicencia, ConductorCategoriaLicencia } from '@db/tables/conductor.table';
import type { ConductorDocumentoTipo } from '@db/tables/conductor-documento.table';

export class DocumentosAgrupadosConductorDto implements Record<ConductorDocumentoTipo, ConductorDocumentoResultDto[]> {
  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  dni: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  licencia_mtc: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  seguro_vida_ley: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  sctr: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  examen_medico: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  psicosensometrico: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  induccion_general: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  manejo_defensivo: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  licencia_interna: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  autoriza_ssgg: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  curso_seguridad_portuaria: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  curso_mercancias_peligrosas: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  curso_basico_pbip: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  examen_medico_temporal: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  induccion_visita: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  em_visita: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  pase_conduc: ConductorDocumentoResultDto[];

  @ApiProperty({ type: [ConductorDocumentoResultDto] })
  foto_funcionario: ConductorDocumentoResultDto[];
}

export class ConductorResultDto {
  @ApiProperty({ example: 1, description: 'Driver ID' })
  id: number;

  @ApiProperty({ example: '12345678', description: 'Driver DNI' })
  dni: string;

  @ApiProperty({ example: 'Juan Carlos', description: 'Driver first names' })
  nombres: string;

  @ApiProperty({ example: 'Perez Garcia', description: 'Driver last names' })
  apellidos: string;

  @ApiProperty({
    example: 'Juan Carlos Perez Garcia',
    description: 'Driver full name',
  })
  nombreCompleto: string;

  @ApiPropertyOptional({ example: 'juan@example.com', description: 'Driver email' })
  email: string | null;

  @ApiPropertyOptional({ example: '987654321', description: 'Driver phone number' })
  celular: string | null;

  @ApiProperty({
    example: 'Q07864165',
    description: 'Driver license number',
  })
  numeroLicencia: string;

  @ApiProperty({
    enum: conductoresClaseLicencia.enumValues,
    example: conductoresClaseLicencia.enumValues[0],
    description: 'Driver license class',
  })
  claseLicencia: ConductorClaseLicencia;

  @ApiProperty({
    enum: conductoresCategoriaLicencia.enumValues,
    example: conductoresCategoriaLicencia.enumValues[0],
    description: 'Driver license category',
  })
  categoriaLicencia: ConductorCategoriaLicencia;

  @ApiPropertyOptional({
    example: ['https://res.cloudinary.com/xxx/fotocheck.jpg'],
    description: 'Lista de URLs de fotochecks del conductor',
    type: [String],
  })
  fotocheck: string[];

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  creadoEn: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Update date',
  })
  actualizadoEn: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Deletion date (if applicable)',
    nullable: true,
  })
  eliminadoEn: Date | null;

  @ApiProperty({ description: 'Driver documents grouped by type' })
  documentos: DocumentosAgrupadosConductorDto;
}
