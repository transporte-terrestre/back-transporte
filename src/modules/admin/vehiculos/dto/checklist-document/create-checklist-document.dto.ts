import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum, IsJSON, ValidateNested, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { checklistInputEnum } from '@db/tables/vehiculo-checklist-document-item.table';
import type { ChecklistInputTipo } from '@db/tables/vehiculo-checklist-document-item.table';

export class VehiculoChecklistDocumentItemCreateDto {
  @ApiProperty({ example: 'Luces altas (lado derecho)', description: 'Pregunta o Label del ítem' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ enum: checklistInputEnum.enumValues, example: 'check', description: 'Tipo de input esperado' })
  @IsEnum(checklistInputEnum.enumValues)
  tipoInput: ChecklistInputTipo;

  @ApiPropertyOptional({ example: 'Vigente', description: 'Valor esperado (para validación automática)' })
  @IsString()
  @IsOptional()
  valorEsperado?: string;

  @ApiPropertyOptional({ example: 10, description: 'Orden de aparición' })
  @IsInt()
  @IsOptional()
  orden?: number;

  @ApiPropertyOptional({ description: 'Metadatos adicionales (JSON)' })
  @IsOptional()
  metadatos?: Record<string, any>;
}

export class VehiculoChecklistDocumentCreateDto {
  @ApiProperty({ example: 1, description: 'ID del Tipo de Checklist (Catálogo)' })
  @IsInt()
  checklistItemId: number;

  @ApiProperty({ type: [VehiculoChecklistDocumentItemCreateDto], description: 'Lista de ítems de la versión' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VehiculoChecklistDocumentItemCreateDto)
  items: VehiculoChecklistDocumentItemCreateDto[];
}
