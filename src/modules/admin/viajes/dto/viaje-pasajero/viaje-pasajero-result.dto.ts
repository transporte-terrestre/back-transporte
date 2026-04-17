import { ApiProperty } from '@nestjs/swagger';

export class ViajePasajeroResultDto {
  @ApiProperty({ example: 1, description: 'ID del registro' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID del viaje' })
  viajeId: number;

  @ApiProperty({ example: 1, description: 'ID del pasajero', required: false })
  pasajeroId?: number | null;

  @ApiProperty({ example: '12345678', description: 'DNI del pasajero', required: false })
  dni?: string | null;

  @ApiProperty({ example: 'Juan', description: 'Nombres del pasajero', required: false })
  nombres?: string | null;

  @ApiProperty({ example: 'Pérez', description: 'Apellidos del pasajero', required: false })
  apellidos?: string | null;
  
  @ApiProperty({ example: 'Empresa S.A.', description: 'Nombre de la empresa del pasajero', required: false })
  empresa?: string | null;

  @ApiProperty({ example: false, description: 'Asistencia del pasajero en la parada consultada' })
  asistencia: boolean;

  @ApiProperty({
    example: 5,
    description: 'ID de la parada donde el pasajero ya tiene asistencia (si abordó en otra parada)',
    required: false,
    nullable: true,
  })
  paradaAsistenciaId?: number | null;

  @ApiProperty({
    example: 'Parada Central',
    description: 'Nombre de la parada donde el pasajero ya tiene asistencia',
    required: false,
    nullable: true,
  })
  paradaAsistenciaNombre?: string | null;

  @ApiProperty({
    example: true,
    description: 'Indica si la asistencia del pasajero coincide con el tramo consultado',
    required: false,
    nullable: true,
  })
  esAsistenciaTramoActual?: boolean | null;

  @ApiProperty({
    example: 5,
    description: 'ID de la parada donde el pasajero bajó (si tiene salida registrada)',
    required: false,
    nullable: true,
  })
  paradaSalidaId?: number | null;

  @ApiProperty({
    example: 'Parada Central',
    description: 'Nombre de la parada donde el pasajero bajó',
    required: false,
    nullable: true,
  })
  paradaSalidaNombre?: string | null;

  @ApiProperty({
    example: true,
    description: 'Indica si la salida del pasajero coincide con el tramo consultado',
    required: false,
    nullable: true,
  })
  esSalidaTramoActual?: boolean | null;

  @ApiProperty({
    example: '2024-03-24T10:30:00Z',
    description: 'Hora en la que se registró la entrada del pasajero (subida)',
    required: false,
    nullable: true,
  })
  horaAsistencia?: string | null;

  @ApiProperty({
    example: '2024-03-24T12:30:00Z',
    description: 'Hora en la que se registró la salida del pasajero (bajada)',
    required: false,
    nullable: true,
  })
  horaSalida?: string | null;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Fecha de creación' })
  creadoEn: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Fecha de actualización' })
  actualizadoEn: Date;
}
