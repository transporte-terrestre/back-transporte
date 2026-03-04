import { ApiProperty } from '@nestjs/swagger';

export class ViajeDetalladoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  tipoRuta: string;

  @ApiProperty({ nullable: true })
  rutaOcasional: string | null;

  @ApiProperty({ nullable: true })
  rutaOrigen: string | null;

  @ApiProperty({ nullable: true })
  rutaDestino: string | null;

  @ApiProperty({
    nullable: true,
    description: 'Distancia estimada del viaje en km',
  })
  distanciaEstimada: string | null;

  @ApiProperty({
    nullable: true,
    description: 'Distancia real al final del viaje en km',
  })
  distanciaFinal: string | null;

  @ApiProperty({
    description: 'Diferencia entre distancia final y estimada (0 si no hay valores)',
  })
  diferencia: number;

  @ApiProperty({ description: 'Horas contratadas para este viaje' })
  horasContrato: string;

  @ApiProperty({ description: 'Horas totales de duración del viaje' })
  horasTotales: number;

  @ApiProperty({ description: 'Horas excedidas sobre el contrato' })
  horasExcedidas: number;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  modalidadServicio: string;

  @ApiProperty()
  fechaSalidaProgramada: Date;

  @ApiProperty({ nullable: true })
  fechaLlegadaProgramada: Date | null;

  @ApiProperty({ nullable: true })
  fechaSalida: Date | null;

  @ApiProperty({ nullable: true })
  fechaLlegada: Date | null;

  @ApiProperty({
    description: 'ID del circuito al que pertenece este viaje',
    nullable: true,
  })
  circuitoId: number | null;

  @ApiProperty({
    description: 'Sentido del viaje',
  })
  sentido: string;
}
