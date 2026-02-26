import { ApiProperty } from '@nestjs/swagger';
import { tipoServicioEnum } from '@db/tables/viaje-servicio.table';
import type { ViajeServicioTipo } from '@db/tables/viaje-servicio.table';

export class ViajePuntoTrayectoDto {
  @ApiProperty({ description: 'Nombre del punto', example: 'Lima' })
  nombre: string;

  @ApiProperty({ description: 'Latitud', example: -12.04318, nullable: true })
  latitud: number | null;

  @ApiProperty({ description: 'Longitud', example: -77.02824, nullable: true })
  longitud: number | null;

  @ApiProperty({
    description: 'Tipo de punto (origen, punto, parada, destino)',
    enum: tipoServicioEnum.enumValues.filter((v) => v !== 'descanso'),
  })
  tipo: ViajeServicioTipo;

  @ApiProperty({ description: 'Orden cronológico/secuencial', example: 1 })
  orden: number;

  @ApiProperty({ description: 'Indica si el conductor ya pasó por este punto', example: true })
  completado: boolean;

  @ApiProperty({ description: 'ID del punto de la ruta fija, si aplica', nullable: true })
  rutaParadaId?: number | null;
}

export class ViajeTrayectoResultDto {
  @ApiProperty({ description: 'Puntos del trayecto en orden secuencial', type: [ViajePuntoTrayectoDto] })
  puntos: ViajePuntoTrayectoDto[];
}
