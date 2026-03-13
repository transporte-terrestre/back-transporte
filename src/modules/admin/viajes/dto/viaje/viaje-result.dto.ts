import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { viajesEstado, viajesModalidadServicio, viajesTipoRuta, viajesTurno, viajesSentido } from '@db/tables/viaje.table';
import { ConductorResultDto } from '../../../conductores/dto/conductor/conductor-result.dto';
import { VehiculoResultDto } from '../../../vehiculos/dto/vehiculo/vehiculo-result.dto';
import { ClienteResultDto } from '../../../clientes/dto/cliente/cliente-result.dto';
import { EntidadResultDto } from '../../../clientes/dto/entidad/entidad-result.dto';
import { viajeConductoresRol } from '@db/tables/viaje-conductor.table';
import { viajeVehiculosRol } from '@db/tables/viaje-vehiculo.table';
import type { ViajeModalidadServicio, ViajeEstado, ViajeTipoRuta, ViajeTurno, ViajeSentido } from '@db/tables/viaje.table';
import type { ViajeConductorRol } from '@db/tables/viaje-conductor.table';
import type { ViajeVehiculoRol } from '@db/tables/viaje-vehiculo.table';
import { ViajeComentarioResultDto } from '../viaje-comentario/viaje-comentario-result.dto';
import { RutaResultDto } from '@module/admin/rutas/dto/ruta/ruta-result.dto';

export class ViajeConductorDetalleDto extends OmitType(ConductorResultDto, ['documentos']) {
  @ApiProperty({ example: true, description: 'Es conductor principal' })
  esPrincipal: boolean;

  @ApiProperty({
    enum: viajeConductoresRol.enumValues,
    example: viajeConductoresRol.enumValues[0],
    description: 'Rol del conductor',
  })
  rol: ViajeConductorRol;
}

export class ViajeVehiculoDetalleDto extends OmitType(VehiculoResultDto, ['documentos', 'propietarios', 'proveedores']) {
  @ApiProperty({ example: true, description: 'Es vehículo principal' })
  esPrincipal: boolean;

  @ApiProperty({
    enum: viajeVehiculosRol.enumValues,
    example: viajeVehiculosRol.enumValues[0],
    description: 'Rol del vehículo',
  })
  rol: ViajeVehiculoRol;
}

export class ViajeComentarioDetalleDto extends ViajeComentarioResultDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del usuario' })
  usuarioNombreCompleto: string;
}

export class ClienteViajeResultDto extends OmitType(ClienteResultDto, ['documentos']) {}

export class ViajeResultDto {
  @ApiProperty({ example: 1, description: 'Trip ID' })
  id: number;

  @ApiPropertyOptional({ example: 1, description: 'ID de la ruta programada' })
  rutaId: number | null;

  @ApiPropertyOptional({
    example: 'Lima - Arequipa (Ocasional)',
    description: 'Descripción de ruta ocasional',
  })
  rutaOcasional: string | null;

  @ApiProperty({
    enum: viajesTipoRuta.enumValues,
    example: viajesTipoRuta.enumValues[0],
    description: 'Tipo de ruta',
  })
  tipoRuta: ViajeTipoRuta;

  @ApiPropertyOptional({
    example: '450.00',
    description: 'Distancia estimada del viaje en km',
  })
  distanciaEstimada: string | null;

  @ApiPropertyOptional({
    example: '455.50',
    description: 'Distancia real al final del viaje en km',
  })
  distanciaFinal: string | null;

  @ApiProperty({ example: 1, description: 'ID del cliente' })
  clienteId: number;

  @ApiPropertyOptional({ example: 1, description: 'ID de la entidad' })
  entidadId: number | null;

  @ApiProperty({
    enum: viajesModalidadServicio.enumValues,
    example: viajesModalidadServicio.enumValues[0],
    description: 'Modalidad de servicio',
  })
  modalidadServicio: ViajeModalidadServicio;

  @ApiProperty({
    example: '8.00',
    description: 'Horas contratadas',
  })
  horasContrato: string;

  @ApiProperty({
    enum: viajesEstado.enumValues,
    example: viajesEstado.enumValues[0],
    description: 'Estado del viaje',
  })
  estado: ViajeEstado;

  @ApiPropertyOptional({
    enum: viajesTurno.enumValues,
    example: 'dia',
    description: 'Turno del viaje (día o noche)',
  })
  turno?: ViajeTurno;

  @ApiProperty({
    enum: viajesSentido.enumValues,
    example: 'ida',
    description: 'Sentido del viaje (ida o vuelta)',
  })
  sentido: ViajeSentido;

  @ApiPropertyOptional({
    example: '242155',
    description: 'Número de vale de combustible',
  })
  numeroVale?: string;

  @ApiProperty({
    example: '2025-01-01T10:00:00Z',
    description: 'Scheduled departure date',
  })
  fechaSalidaProgramada: Date;

  @ApiPropertyOptional({
    example: '2025-01-01T18:00:00Z',
    description: 'Scheduled arrival date',
  })
  fechaLlegadaProgramada: Date | null;

  @ApiPropertyOptional({
    example: '2025-01-01T10:00:00Z',
    description: 'Real Departure date',
  })
  fechaSalida: Date | null;

  @ApiPropertyOptional({
    example: '2025-01-01T18:00:00Z',
    description: 'Real Arrival date',
  })
  fechaLlegada: Date | null;

  @ApiPropertyOptional({ description: 'Datos adicionales del viaje (metadata)' })
  metadata: Record<string, any> | null;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  creadoEn: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Update date',
  })
  actualizadoEn: Date;

  @ApiPropertyOptional({ type: [ViajeConductorDetalleDto] })
  conductores?: ViajeConductorDetalleDto[];

  @ApiPropertyOptional({ type: [ViajeVehiculoDetalleDto] })
  vehiculos?: ViajeVehiculoDetalleDto[];

  @ApiPropertyOptional({ type: [ViajeComentarioDetalleDto] })
  comentarios?: ViajeComentarioDetalleDto[];

  @ApiPropertyOptional({
    type: ClienteViajeResultDto,
  })
  cliente?: ClienteViajeResultDto;

  @ApiPropertyOptional({
    type: EntidadResultDto,
  })
  entidad?: EntidadResultDto;

  @ApiPropertyOptional({ type: RutaResultDto })
  ruta?: Omit<RutaResultDto, 'documentos'>;

  @ApiProperty({ example: false, description: 'Indica si el checklist de salida fue validado' })
  checkInSalida: boolean;

  @ApiProperty({ example: false, description: 'Indica si el checklist de llegada fue validado' })
  checkInLlegada: boolean;
}
