import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { viajesEstado, modalidadServicio, viajesTipoRuta } from '@model/tables/viaje.model';
import type { ViajeModalidadServicio, ViajeEstado, ViajeTipoRuta } from '@model/tables/viaje.model';
import { ConductorResultDto } from '@module/admin/conductores/dto/conductor-result.dto';
import { VehiculoResultDto } from '@module/admin/vehiculos/dto/vehiculo-result.dto';
import { ClienteResultDto } from '@module/admin/clientes/dto/cliente-result.dto';
import { RutaResultDto } from '@module/admin/rutas/dto/ruta-result.dto';

export class ConductorViajeDto extends OmitType(ConductorResultDto, ['documentos']) {}
export class VehiculoViajeDto extends OmitType(VehiculoResultDto, ['documentos', 'propietarios', 'proveedores']) {}
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

  @ApiPropertyOptional({
    example: ['Juan Pérez', 'María García'],
    description: 'Lista de tripulantes',
  })
  tripulantes: string[];

  @ApiProperty({
    enum: modalidadServicio.enumValues,
    example: modalidadServicio.enumValues[0],
    description: 'Modalidad de servicio',
  })
  modalidadServicio: ViajeModalidadServicio;

  @ApiProperty({
    enum: viajesEstado.enumValues,
    example: viajesEstado.enumValues[0],
    description: 'Trip status',
  })
  estado: ViajeEstado;

  @ApiProperty({
    example: '2025-01-01T10:00:00Z',
    description: 'Departure date',
  })
  fechaSalida: Date;

  @ApiPropertyOptional({
    example: '2025-01-01T18:00:00Z',
    description: 'Arrival date',
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

  @ApiPropertyOptional({ type: RutaResultDto })
  ruta?: RutaResultDto;
}
