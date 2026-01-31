import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { checklistItemSeccion } from '@db/tables/checklist-item.table';
import type { ChecklistItemSeccion } from '@db/tables/checklist-item.table';

export class ChecklistItemResultDto {
  @ApiProperty({ example: 1, description: 'ID del item' })
  id: number;

  @ApiProperty({ enum: checklistItemSeccion.enumValues, description: 'Sección del checklist' })
  seccion: ChecklistItemSeccion;

  @ApiProperty({ example: 'Reporte diario', description: 'Nombre del item' })
  nombre: string;

  @ApiPropertyOptional({ example: 'Bitácora actualizada', description: 'Descripción' })
  descripcion?: string;

  @ApiPropertyOptional({ example: 'clipboard', description: 'Icono' })
  icono?: string;

  @ApiProperty({ example: 1, description: 'Orden' })
  orden: number;

  @ApiProperty({ example: true, description: 'Activo' })
  activo: boolean;

  @ApiProperty({ description: 'Fecha creación' })
  creadoEn: Date;

  @ApiProperty({ description: 'Fecha actualización' })
  actualizadoEn: Date;
}
