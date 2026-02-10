import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min, Max } from 'class-validator';
import { PaginationMetaDto } from '../../../../../common/dto/pagination-meta.dto';

export const FiltroDocumentoEstado = {
  COMPLETO: 'completo',
  INCOMPLETO: 'incompleto',
} as const;

export type FiltroDocumentoEstado = typeof FiltroDocumentoEstado[keyof typeof FiltroDocumentoEstado];

export class ConductorDocumentosEstadoQueryDto {
  @ApiProperty({
    description: 'Número de página (comienza en 1)',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filtrar por estado de documentos',
    enum: Object.values(FiltroDocumentoEstado),
    example: FiltroDocumentoEstado.INCOMPLETO,
    required: false,
  })
  @IsOptional()
  @IsIn(Object.values(FiltroDocumentoEstado))
  filtro?: FiltroDocumentoEstado = FiltroDocumentoEstado.INCOMPLETO;
}

export class ConductorEstadoDocumentosDto {
  @ApiProperty({ description: 'ID del conductor', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nombres del conductor', example: 'Juan Carlos' })
  nombres: string;

  @ApiProperty({ description: 'Apellidos del conductor', example: 'Pérez López' })
  apellidos: string;

  @ApiProperty({ description: 'Fotos del conductor', example: ['https://...'], type: [String] })
  fotocheck: string[];

  @ApiProperty({ description: 'Estado del documento', example: 'activo' })
  dni: string;

  @ApiProperty({ example: 'activo' })
  licencia_mtc: string;

  @ApiProperty({ example: 'nulo' })
  seguro_vida_ley: string;

  @ApiProperty({ example: 'activo' })
  sctr: string;

  @ApiProperty({ example: 'caducado' })
  examen_medico: string;

  @ApiProperty({ example: 'activo' })
  psicosensometrico: string;

  @ApiProperty({ example: 'nulo' })
  induccion_general: string;

  @ApiProperty({ example: 'activo' })
  manejo_defensivo: string;

  @ApiProperty({ example: 'nulo' })
  licencia_interna: string;

  @ApiProperty({ example: 'activo' })
  autoriza_ssgg: string;

  @ApiProperty({ example: 'nulo' })
  curso_seguridad_portuaria: string;

  @ApiProperty({ example: 'activo' })
  curso_mercancias_peligrosas: string;

  @ApiProperty({ example: 'nulo' })
  curso_basico_pbip: string;

  @ApiProperty({ example: 'activo' })
  examen_medico_temporal: string;

  @ApiProperty({ example: 'nulo' })
  induccion_visita: string;

  @ApiProperty({ example: 'activo' })
  em_visita: string;

  @ApiProperty({ example: 'nulo' })
  pase_conduc: string;

  @ApiProperty({ example: 'activo' })
  foto_funcionario: string;
}

export class PaginatedConductorEstadoDocumentosResultDto {
  @ApiProperty({
    description: 'Lista de conductores con sus estados de documentos',
    type: [ConductorEstadoDocumentosDto],
  })
  data: ConductorEstadoDocumentosDto[];

  @ApiProperty({
    description: 'Metadatos de paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
