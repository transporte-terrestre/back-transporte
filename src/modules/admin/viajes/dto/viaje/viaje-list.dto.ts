import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { viajesEstado, viajesModalidadServicio, viajesTipoRuta, viajesTurno, viajesSentido } from '@db/tables/viaje.table';
import type { ViajeModalidadServicio, ViajeEstado, ViajeTipoRuta, ViajeTurno, ViajeSentido } from '@db/tables/viaje.table';
import { ConductorResultDto } from '@module/admin/conductores/dto/conductor/conductor-result.dto';
import { VehiculoResultDto } from '@module/admin/vehiculos/dto/vehiculo/vehiculo-result.dto';
import { ClienteResultDto } from '@module/admin/clientes/dto/cliente/cliente-result.dto';
import { EntidadResultDto } from '@module/admin/clientes/dto/entidad/entidad-result.dto';
import { EncargadoResultDto } from '@module/admin/clientes/dto/encargado/encargado-result.dto';
import { RutaResultDto } from '@module/admin/rutas/dto/ruta/ruta-result.dto';

export class ConductorViajeDto extends OmitType(ConductorResultDto, ['documentos']) {}
export class VehiculoViajeDto extends OmitType(VehiculoResultDto, ['documentos', 'proveedores']) {}
export class ClienteViajeDto extends OmitType(ClienteResultDto, ['documentos']) {}

export class ViajeListDto {
  @ApiProperty({ example: 1, description: 'Trip ID' })
  id: number;

  @ApiPropertyOptional({ example: 1, description: 'ID de la ruta programada' })
  rutaId: number | null;

  @ApiPropertyOptional({
    example: 'Lima - Arequipa (Ocasional)',
    description: 'Descripción de ruta ocasional',
  })
  rutaOcasional: string | null;

  @ApiPropertyOptional({
    example: 'Lima - Arequipa Especial',
    description: 'Nombre de la ruta',
  })
  nombreRuta: string | null;

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

  @ApiPropertyOptional({ example: 1, description: 'ID del encargado' })
  encargadoId: number | null;

  @ApiProperty({
    enum: viajesModalidadServicio.enumValues,
    example: viajesModalidadServicio.enumValues[0],
    description: 'Modalidad de servicio',
  })
  modalidadServicio: ViajeModalidadServicio;

  @ApiProperty({
    enum: viajesEstado.enumValues,
    example: viajesEstado.enumValues[0],
    description: 'Trip status',
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

  @ApiPropertyOptional({ type: ConductorViajeDto })
  conductorPrincipal?: ConductorViajeDto;

  @ApiPropertyOptional({ type: VehiculoViajeDto })
  vehiculoPrincipal?: VehiculoViajeDto;

  @ApiPropertyOptional({ type: ClienteViajeDto })
  cliente?: ClienteViajeDto;

  @ApiPropertyOptional({ type: EntidadResultDto })
  entidad?: EntidadResultDto;

  @ApiPropertyOptional({ type: EncargadoResultDto })
  encargado?: EncargadoResultDto;

  @ApiPropertyOptional({ type: RutaResultDto })
  ruta?: RutaResultDto;
}
