import { ApiProperty } from '@nestjs/swagger';
import { PasajeroDTO } from '@db/tables/pasajero.table';

export class ViajePasajeroDetalleDto {
  @ApiProperty({ example: 1, description: 'ID del pasajero' })
  id: number;

  @ApiProperty({ example: '12345678', description: 'DNI del pasajero' })
  dni: string;

  @ApiProperty({ example: 'Juan', description: 'Nombres del pasajero' })
  nombres: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellidos del pasajero' })
  apellidos: string;
}

export class ViajePasajeroResultDto {
  @ApiProperty({ example: 1, description: 'ID del registro' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID del viaje' })
  viajeId: number;

  @ApiProperty({ example: 1, description: 'ID del pasajero', required: false })
  pasajeroId?: number | null;

  @ApiProperty({ example: '12345678', description: 'DNI del pasajero ad-hoc', required: false })
  dni?: string | null;

  @ApiProperty({ example: 'Juan', description: 'Nombres del pasajero ad-hoc', required: false })
  nombres?: string | null;

  @ApiProperty({ example: 'Pérez', description: 'Apellidos del pasajero ad-hoc', required: false })
  apellidos?: string | null;

  @ApiProperty({ example: false, description: 'Asistencia del pasajero' })
  asistencia: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Fecha de creación' })
  creadoEn: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Fecha de actualización' })
  actualizadoEn: Date;

  @ApiProperty({ type: ViajePasajeroDetalleDto, required: false })
  pasajero?: ViajePasajeroDetalleDto | null;
}
