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

  @ApiProperty({ nullable: true, description: 'Turno del viaje: día o noche' })
  turno: string | null;

  @ApiProperty({ nullable: true, description: 'Número de vale de combustible' })
  numeroVale: string | null;

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

  // === Datos del vehículo principal ===

  @ApiProperty({ nullable: true, description: 'Placa del vehículo principal' })
  vehiculoPlaca: string | null;

  @ApiProperty({ nullable: true, description: 'Marca del vehículo principal' })
  vehiculoMarca: string | null;

  @ApiProperty({ nullable: true, description: 'Modelo del vehículo principal' })
  vehiculoModelo: string | null;

  // === Datos del conductor principal ===

  @ApiProperty({ nullable: true, description: 'Nombre completo del conductor principal' })
  conductorNombre: string | null;

  @ApiProperty({ nullable: true, description: 'DNI del conductor principal' })
  conductorDni: string | null;

  // === Datos del cliente ===

  @ApiProperty({ description: 'Nombre del cliente' })
  clienteNombre: string;

  @ApiProperty({ nullable: true, description: 'Documento del cliente (RUC o DNI)' })
  clienteDocumento: string | null;

  // === Datos de la entidad ===

  @ApiProperty({ nullable: true, description: 'Nombre del servicio/entidad' })
  entidadNombre: string | null;
}
