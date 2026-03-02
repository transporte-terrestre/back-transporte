import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { tipoTramoEnum } from '@db/tables/viaje-tramo.table';
import type { ViajeTramoTipo } from '@db/tables/viaje-tramo.table';

export class ViajeItemHojaRutaDto {
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

  @ApiProperty({ description: 'Hora de término del tramo', example: '10:20 AM' })
  horaTermino: string;

  @ApiProperty({ description: 'Kilometraje al final del tramo', example: '29,200 KM' })
  kmFinal: string;

  @ApiProperty({ description: 'Tiempo de recorrido en formato legible', example: '20 min' })
  tiempoRecorrido: string;

  @ApiProperty({ description: 'Kilometraje recorrido en el tramo', example: '41 KM' })
  kilometrajeRecorrido: string;

  @ApiPropertyOptional({ example: 'punto', description: 'Tipo de tramo del punto de llegada', enum: tipoTramoEnum.enumValues })
  tipoDestino?: ViajeTramoTipo;
}

export class ViajeHojaRutaResultDto {
  @ApiProperty({ description: 'Lista de tramos del viaje', type: [ViajeItemHojaRutaDto] })
  tramos: ViajeItemHojaRutaDto[];

  @ApiProperty({ description: 'Resumen total de tiempo de viaje', example: '1h 30min' })
  tiempoTotal: string;

  @ApiProperty({ description: 'Resumen total de kilometraje recorrido', example: '120 KM' })
  kilometrajeTotal: string;
}
