import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { viajeChecklistTipo } from '@db/tables/viaje-checklist.table';
import type { ViajeChecklistTipo } from '@db/tables/viaje-checklist.table';

export class ViajeChecklistItemDetalleDto {
  @ApiProperty({ example: 1, description: 'ID del item del catálogo' })
  checklistItemId: number;

  @ApiProperty({ example: 10, description: 'ID del documento de configuración, null si no tiene' })
  vehiculoChecklistDocumentId: number | null;

  @ApiPropertyOptional({ example: 'Sin novedad', description: 'Observación del item' })
  observacion?: string;

  @ApiProperty({ description: 'Fecha creación', nullable: true })
  creadoEn: Date | null;

  @ApiProperty({ description: 'Fecha actualización', nullable: true })
  actualizadoEn: Date | null;

  @ApiProperty({ example: 'Llantas', description: 'Nombre del item (Catálogo)' })
  nombre: string;

  @ApiPropertyOptional({ example: 'Revisión estado', description: 'Descripción del item (Catálogo)' })
  descripcion?: string;

  @ApiProperty({ example: 1, description: 'Orden' })
  orden: number;

  @ApiProperty({
    example: true,
    description: 'Indica si es una actualización de un documento existente para este viaje',
    default: false,
    required: false,
  })
  isUpdate?: boolean;
}

export class ViajeChecklistResultDto {
  @ApiProperty({ example: 1, description: 'ID del checklist', nullable: true })
  id: number | null;

  @ApiProperty({ example: 1, description: 'ID del viaje' })
  viajeId: number;

  @ApiProperty({ enum: viajeChecklistTipo.enumValues, description: 'Tipo' })
  tipo: ViajeChecklistTipo;

  @ApiPropertyOptional({ example: 1, description: 'ID de quien validó' })
  validadoPor?: number;

  @ApiPropertyOptional({ description: 'Fecha de validación' })
  validadoEn?: Date;

  @ApiPropertyOptional({ example: 'Sin observaciones', description: 'Observaciones' })
  observaciones?: string;

  @ApiProperty({ description: 'Fecha creación', nullable: true })
  creadoEn: Date | null;

  @ApiProperty({ description: 'Fecha actualización', nullable: true })
  actualizadoEn: Date | null;

  @ApiPropertyOptional({ type: [ViajeChecklistItemDetalleDto], description: 'Items del checklist' })
  items?: ViajeChecklistItemDetalleDto[];

  @ApiPropertyOptional({ example: 'Notificación enviada por items faltantes.', description: 'Mensaje de estado de notificación' })
  message?: string;
}
