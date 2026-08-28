import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbastecimientoMetadataDto } from './abastecimiento-create.dto';

export class AbastecimientoResultDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  vehiculoId: number;

  @ApiPropertyOptional({ example: 10, nullable: true })
  viajeTramoId?: number | null;

  @ApiPropertyOptional({ example: 3, nullable: true })
  viajeId?: number | null;

  @ApiPropertyOptional({ example: '45952.50', nullable: true })
  kilometrajeSuelto?: string | null;

  @ApiPropertyOptional({ example: 'Grifo Repsol - Av. Principal', nullable: true })
  tramoSuelto?: string | null;

  @ApiPropertyOptional({ example: '2026-08-27T14:35:00.000Z', format: 'date-time', nullable: true })
  fechaAbastecimiento?: Date | null;

  @ApiPropertyOptional({ type: AbastecimientoMetadataDto, nullable: true })
  metadata?: AbastecimientoMetadataDto | null;

  @ApiProperty({ example: 'diesel' })
  combustible: string;

  @ApiProperty({ example: '10.50' })
  galonesEstablecidos: string;

  @ApiProperty({ example: 'ABC-123', required: false })
  vehiculoPlaca?: string | null;

  @ApiProperty({ example: 'VAN-01', required: false })
  vehiculoCodigoInterno?: string | null;

  @ApiProperty({ example: ['https://ejemplo.com/vehiculo.jpg'], required: false, type: [String] })
  vehiculoImagenes?: string[];

  @ApiProperty({ example: 'Grifo Primax', required: false, nullable: true })
  tramoNombreLugar?: string | null;

  @ApiProperty({ example: '2026-05-21T12:00:00Z', required: false, nullable: true })
  tramoHoraFinal?: Date | null;

  @ApiPropertyOptional({ example: 45952.5, nullable: true })
  tramoKilometrajeFinal?: number | null;

  @ApiPropertyOptional({ example: -12.121907562533325, nullable: true })
  tramoLatitud?: number | null;

  @ApiPropertyOptional({ example: -76.9966634621533, nullable: true })
  tramoLongitud?: number | null;

  @ApiProperty({ example: '2026-05-21T12:00:00Z' })
  creadoEn: Date;

  @ApiProperty({ example: '2026-05-21T12:00:00Z' })
  actualizadoEn: Date;
}
