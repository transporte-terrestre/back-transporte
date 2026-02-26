import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { tipoServicioEnum } from '@db/tables/viaje-servicio.table';
import type { ViajeServicioTipo } from '@db/tables/viaje-servicio.table';

export class ViajeServicioTramoDto {
  @ApiProperty({ description: 'Hora de salida del tramo', example: '10:00 AM' })
  horaSalida: string;

  @ApiProperty({ description: 'Kilometraje al inicio del tramo', example: '29,159 KM' })
  kmInicial: string;

  @ApiProperty({ description: 'Punto de partida', example: 'Villa El Salvador' })
  puntoPartida: string;

  @ApiProperty({ description: 'Punto de llegada', example: 'Parada 1' })
  puntoLlegada: string;

  @ApiPropertyOptional({ description: 'Número de pasajeros', example: 12 })
  numeroPasajeros: number;

  @ApiProperty({ description: 'Hora de término del servicio', example: '10:20 AM' })
  horaTermino: string;

  @ApiProperty({ description: 'Kilometraje al final del tramo', example: '29,200 KM' })
  kmFinal: string;

  @ApiProperty({ description: 'Tiempo de servicio en formato legible', example: '20 min' })
  tiempoServicio: string;

  @ApiProperty({ description: 'Kilometraje recorrido en el tramo', example: '41 KM' })
  kilometrajeServicio: string;

  @ApiPropertyOptional({ example: 'punto', description: 'Tipo de servicio del punto de llegada', enum: tipoServicioEnum.enumValues })
  tipoDestino?: ViajeServicioTipo;
}

export class ViajeHojaRutaResultDto {
  @ApiProperty({ description: 'Lista de tramos del viaje', type: [ViajeServicioTramoDto] })
  tramos: ViajeServicioTramoDto[];

  @ApiProperty({ description: 'Resumen total de tiempo de servicio', example: '1h 30min' })
  tiempoTotal: string;

  @ApiProperty({ description: 'Resumen total de kilometraje recorrido', example: '120 KM' })
  kilometrajeTotal: string;
}
