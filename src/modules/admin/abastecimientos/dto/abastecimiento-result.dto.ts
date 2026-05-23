import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AbastecimientoResultDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  vehiculoId: number;

  @ApiPropertyOptional({ example: 10, nullable: true })
  viajeTramoId?: number | null;

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

  @ApiProperty({ example: '2026-05-21T12:00:00Z' })
  creadoEn: Date;

  @ApiProperty({ example: '2026-05-21T12:00:00Z' })
  actualizadoEn: Date;
}
