import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { viajeChecklistTipo } from '@db/tables/viaje-checklist.table';
import type { ViajeChecklistTipo } from '@db/tables/viaje-checklist.table';

export class ViajeChecklistQueryDto {
  @ApiProperty({
    description: 'Tipo de checklist (salida o llegada)',
    enum: viajeChecklistTipo.enumValues,
    example: viajeChecklistTipo.enumValues[0],
  })
  @IsIn(viajeChecklistTipo.enumValues)
  tipo: ViajeChecklistTipo;
}
