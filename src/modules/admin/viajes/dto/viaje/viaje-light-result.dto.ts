import { ApiProperty } from '@nestjs/swagger';
import { viajesEstado } from '@db/tables/viaje.table';
import type { ViajeEstado } from '@db/tables/viaje.table';

export class ViajeLightResultDto {
  @ApiProperty({ example: 1, description: 'ID del viaje' })
  id: number;

  @ApiProperty({ example: 'Lima - Ica', description: 'Nombre de la ruta' })
  rutaNombre: string;

  @ApiProperty({
    enum: viajesEstado.enumValues,
    example: viajesEstado.enumValues[0],
    description: 'Estado del viaje',
  })
  estado: ViajeEstado;

  @ApiProperty({
    example: '2025-01-01T10:00:00Z',
    description: 'Fecha de salida',
  })
  fecha: Date;

  @ApiProperty({ example: true, description: 'Checklist de salida validado' })
  checkInSalida: boolean;

  @ApiProperty({ example: false, description: 'Checklist de llegada validado' })
  checkInLlegada: boolean;
}
