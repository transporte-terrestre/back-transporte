import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import type { VehiculoChecklistDocumentViajeTipo } from '@db/tables/vehiculo-checklist-document.table';
import { PaginationMetaDto } from '../../../../../common/dto/pagination-meta.dto';

export class VehiculoChecklistHistoryQueryDto {
  @ApiProperty({ description: 'ID del ChecklistItem (Tipo de documento)', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  checklistItemId: number;

  @ApiProperty({ description: 'Página/Offset', example: 1, required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Límite por página', example: 10, required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class VehiculoChecklistHistoryItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  vehiculoId: number;

  @ApiProperty({ example: 1 })
  checklistItemId: number;

  @ApiProperty({ example: 'v00001_001_...' })
  version: string;

  @ApiProperty({ example: true })
  activo: boolean;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  creadoEn: Date;

  @ApiProperty({ example: 1, nullable: true })
  viajeId: number | null;

  @ApiProperty({ example: 'salida', enum: ['salida', 'llegada'] })
  viajeTipo: VehiculoChecklistDocumentViajeTipo;
}

export class PaginatedVehiculoChecklistHistoryResultDto {
  @ApiProperty({ type: [VehiculoChecklistHistoryItemDto] })
  data: VehiculoChecklistHistoryItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
