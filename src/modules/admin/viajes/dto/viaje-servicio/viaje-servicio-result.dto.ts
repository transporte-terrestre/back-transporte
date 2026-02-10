import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ViajeServicioResultDto {
  @ApiProperty({ example: 1, description: 'ID del servicio' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID del viaje al que pertenece' })
  viajeId: number;

  @ApiProperty({ example: 1, description: 'Orden del servicio en el día' })
  orden: number;

  @ApiPropertyOptional({ example: 1, description: 'ID de la parada de partida' })
  paradaPartidaId?: number;

  @ApiPropertyOptional({
    example: 'Cochera Chorrillos',
    description: 'Nombre de la parada de partida',
  })
  paradaPartidaNombre?: string;

  @ApiPropertyOptional({ example: 2, description: 'ID de la parada de llegada' })
  paradaLlegadaId?: number;

  @ApiPropertyOptional({
    example: 'PEIP - Educans',
    description: 'Nombre de la parada de llegada',
  })
  paradaLlegadaNombre?: string;

  @ApiProperty({ example: '06:45:00', description: 'Hora de salida' })
  horaSalida: string;

  @ApiPropertyOptional({ example: '07:45:00', description: 'Hora de término' })
  horaTermino?: string;

  @ApiProperty({ example: 94880, description: 'Kilometraje inicial' })
  kmInicial: number;

  @ApiPropertyOptional({ example: 94891, description: 'Kilometraje final' })
  kmFinal?: number;

  @ApiPropertyOptional({ example: 11, description: 'Kilometraje del servicio (kmFinal - kmInicial)' })
  kmServicio?: number;

  @ApiPropertyOptional({ example: 60, description: 'Tiempo del servicio en minutos' })
  tiempoServicioMinutos?: number;

  @ApiPropertyOptional({ example: 12, description: 'Número de pasajeros' })
  numeroPasajeros?: number;

  @ApiPropertyOptional({ example: 'Servicio sin novedad', description: 'Observaciones' })
  observaciones?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  creadoEn: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  actualizadoEn: Date;
}
