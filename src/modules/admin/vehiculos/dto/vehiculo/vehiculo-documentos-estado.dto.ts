import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min, Max } from 'class-validator';
import { PaginationMetaDto } from '../../../../../common/dto/pagination-meta.dto';

export const FiltroDocumentoEstado = {
  COMPLETO: 'completo',
  INCOMPLETO: 'incompleto',
} as const;

export type FiltroDocumentoEstado = typeof FiltroDocumentoEstado[keyof typeof FiltroDocumentoEstado];

export class VehiculoDocumentosEstadoQueryDto {
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

export class VehiculoEstadoDocumentosDto {
  @ApiProperty({
    description: 'ID del vehículo',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Placa del vehículo',
    example: 'ABC-123',
  })
  placa: string;

  @ApiProperty({
    description: 'Imágenes del vehículo',
    example: ['https://ejemplo.com/imagen1.jpg'],
    type: [String],
  })
  imagenes: string[];

  @ApiProperty({
    description: 'Estado del documento: activo (existe y vigente), caducado (existe pero vencido), nulo (no existe)',
    example: 'activo',
  })
  tarjeta_propiedad: string;

  @ApiProperty({ example: 'caducado' })
  tarjeta_unica_circulacion: string;

  @ApiProperty({ example: 'activo' })
  citv: string;

  @ApiProperty({ example: 'nulo' })
  soat: string;

  @ApiProperty({ example: 'activo' })
  poliza: string;

  @ApiProperty({ example: 'nulo' })
  certificado_operatividad_factura: string;

  @ApiProperty({ example: 'activo' })
  plan_mantenimiento_historico: string;

  @ApiProperty({ example: 'nulo' })
  certificado_instalacion_gps: string;

  @ApiProperty({ example: 'activo' })
  certificado_valor_anadido: string;

  @ApiProperty({ example: 'nulo' })
  constancia_gps: string;

  @ApiProperty({ example: 'caducado' })
  certificado_tacos: string;

  @ApiProperty({ example: 'activo' })
  certificado_extintores_hidrostatica: string;

  @ApiProperty({ example: 'nulo' })
  certificado_norma_r66: string;

  @ApiProperty({ example: 'activo' })
  certificado_laminados_lunas: string;

  @ApiProperty({ example: 'nulo' })
  certificado_carroceria: string;

  @ApiProperty({ example: 'activo' })
  certificado_caracteristicas_tecnicas: string;

  @ApiProperty({ example: 'nulo' })
  certificado_adas: string;
}

export class PaginatedVehiculoEstadoDocumentosResultDto {
  @ApiProperty({
    description: 'Lista de vehículos con el estado de sus documentos',
    type: [VehiculoEstadoDocumentosDto],
  })
  data: VehiculoEstadoDocumentosDto[];

  @ApiProperty({
    description: 'Metadatos de la paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
