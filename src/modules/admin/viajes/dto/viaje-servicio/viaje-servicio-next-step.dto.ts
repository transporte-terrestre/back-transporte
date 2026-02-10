import { ApiProperty } from '@nestjs/swagger';

export class ViajeServicioNextStepResultDto {
  @ApiProperty({ example: 1, description: 'Siguiente número de orden' })
  orden: number;

  @ApiProperty({ example: 1, description: 'ID de la parada de partida sugerida' })
  paradaPartidaId: number | null;

  @ApiProperty({ example: 2, description: 'ID de la parada de llegada sugerida' })
  paradaLlegadaId: number | null;

  @ApiProperty({ example: 'Cochera', description: 'Nombre de la parada de partida sugerida' })
  paradaPartidaNombre: string | null;

  @ApiProperty({ example: 'Almacén', description: 'Nombre de la parada de llegada sugerida' })
  paradaLlegadaNombre: string | null;

  @ApiProperty({ example: '08:30', description: 'Hora de salida sugerida' })
  horaSalida: string;

  @ApiProperty({ example: 10500, description: 'Kilometraje inicial sugerido' })
  kmInicial: number;

  @ApiProperty({ example: null, description: 'Número de pasajeros (siempre null por defecto)' })
  numeroPasajeros: number | null;

  @ApiProperty({ example: '1/4', description: 'Progreso de paradas' })
  progreso: string;

  @ApiProperty({ example: true, description: 'Indica si es el primer tramo' })
  isStart: boolean;

  @ApiProperty({ example: false, description: 'Indica si es el último tramo' })
  isFinal: boolean;
}
