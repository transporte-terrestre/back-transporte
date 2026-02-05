import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChecklistItemDTO } from '@db/tables/checklist-item.table';

export class ChecklistItemCreateDto implements Omit<ChecklistItemDTO, 'id' | 'creadoEn' | 'actualizadoEn' | 'eliminadoEn'> {
  @ApiProperty({ example: 'Reporte diario', description: 'Nombre del item' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ example: 'Bitácora actualizada', description: 'Descripción del item' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({ example: 1, description: 'Orden de visualización' })
  @IsInt()
  @IsOptional()
  orden?: number;
}
