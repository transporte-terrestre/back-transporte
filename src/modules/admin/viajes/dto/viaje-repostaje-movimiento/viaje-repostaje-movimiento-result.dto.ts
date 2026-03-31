import { ApiProperty } from '@nestjs/swagger';

export class ViajeRepostajeMovimientoResultDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  viajeTramoId: number;

  @ApiProperty({ example: 'diesel' })
  combustible: string;

  @ApiProperty({ example: '10.50' })
  galonesEstablecidos: string;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  creadoEn: Date;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  actualizadoEn: Date;
}
