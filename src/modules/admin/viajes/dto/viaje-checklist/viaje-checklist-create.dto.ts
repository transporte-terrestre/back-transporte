import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { viajeChecklistTipo } from '@db/tables/viaje-checklist.table';
import type { ViajeChecklistTipo } from '@db/tables/viaje-checklist.table';

export class ViajeChecklistCreateDto {
  @ApiProperty({ enum: viajeChecklistTipo.enumValues, description: 'Tipo de checklist' })
  @IsIn(viajeChecklistTipo.enumValues)
  @IsNotEmpty()
  tipo: ViajeChecklistTipo;

  @ApiPropertyOptional({ example: 'Sin observaciones', description: 'Observaciones generales' })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
