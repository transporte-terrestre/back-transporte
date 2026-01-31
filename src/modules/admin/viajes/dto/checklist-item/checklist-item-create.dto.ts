import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChecklistItemDTO, checklistItemSeccion } from '@db/tables/checklist-item.table';
import type { ChecklistItemSeccion } from '@db/tables/checklist-item.table';

export class ChecklistItemCreateDto implements Omit<ChecklistItemDTO, 'id' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ enum: checklistItemSeccion.enumValues, description: 'Sección del checklist' })
  @IsIn(checklistItemSeccion.enumValues)
  @IsNotEmpty()
  seccion: ChecklistItemSeccion;

  @ApiProperty({ example: 'Reporte diario', description: 'Nombre del item' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ example: 'Bitácora actualizada', description: 'Descripción del item' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({ example: 'clipboard', description: 'Icono del item' })
  @IsString()
  @IsOptional()
  icono?: string;

  @ApiPropertyOptional({ example: 1, description: 'Orden del item' })
  @IsInt()
  @IsOptional()
  orden?: number;

  @ApiPropertyOptional({ example: true, description: 'Item activo' })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
