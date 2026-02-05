import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { viajeChecklistTipo } from '@db/tables/viaje-checklist.table';
import type { ViajeChecklistTipo } from '@db/tables/viaje-checklist.table';

export class ChecklistRespuestaJsonDto {
  @ApiPropertyOptional({ example: true, description: 'Valor booleano (para checks)' })
  @IsOptional()
  @IsBoolean()
  check?: boolean;

  @ApiPropertyOptional({ example: 'Texto libre', description: 'Valor de texto o fecha' })
  @IsOptional()
  @IsString()
  valor?: string;

  @ApiPropertyOptional({ example: 'http://foto.com/img.jpg', description: 'URL de foto' })
  @IsOptional()
  @IsString()
  foto?: string;

  @ApiPropertyOptional({ example: ['opcion1'], description: 'Selección múltiple' })
  @IsOptional()
  @IsArray()
  seleccion?: string[];
}

export class ChecklistItemUpsertDto {
  @ApiProperty({ example: 1, description: 'ID del item del catálogo de checklist' })
  @IsInt()
  id: number;

  @ApiProperty({ example: 100, description: 'ID de la versión de configuración (vehiculo_checklist_documents)', required: false })
  @IsInt()
  @IsOptional()
  vehiculoChecklistDocumentId?: number;

  @ApiPropertyOptional({ example: true, description: 'DEPRECATED: Si el item está completado/marcado' })
  @IsBoolean()
  @IsOptional()
  completado?: boolean;

  @ApiPropertyOptional({ example: 'Sin novedad', description: 'Observación del item' })
  @IsOptional()
  @IsString()
  observacion?: string;

  @ApiPropertyOptional({ example: '2023-10-25T12:00:00Z', description: 'Fecha de eliminación (para soft delete)' })
  @IsOptional()
  @IsString() // Se envía como string fecha
  eliminadoEn?: string;
}

// Query param para el tipo de checklist
export class ViajeChecklistUpsertQueryDto {
  @ApiProperty({
    enum: viajeChecklistTipo.enumValues,
    example: 'salida',
    description: 'Tipo de checklist (salida o llegada)',
  })
  @IsIn(viajeChecklistTipo.enumValues)
  tipo: ViajeChecklistTipo;
}

// Body del upsert (sin tipo)
export class ViajeChecklistUpsertBodyDto {
  @ApiPropertyOptional({ example: 'Todo en orden', description: 'Observaciones generales del checklist' })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiProperty({
    type: [ChecklistItemUpsertDto],
    description: 'Lista de items del checklist con su estado',
    example: [
      // Sección CONDUCTOR
      { id: 1, completado: true },
      { id: 2, completado: true },
      { id: 3, completado: true },
      { id: 4, completado: true },
      // Sección SUPERVISIÓN
      { id: 5, completado: true },
      { id: 6, completado: true },
      { id: 7, completado: true },
      { id: 8, completado: true },
      { id: 9, completado: true },
      { id: 10, completado: false },
      { id: 11, completado: true },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemUpsertDto)
  items: ChecklistItemUpsertDto[];
}
