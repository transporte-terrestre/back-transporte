import { ApiProperty } from '@nestjs/swagger';

export class VehiculoEstadoMantenimientoDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ABC-123' })
  placa: string;

  @ApiProperty({ example: '2023-01-01', nullable: true })
  ultimoMantenimientoFecha: string | null;

  @ApiProperty({ example: 10000, nullable: true })
  ultimoMantenimientoKm: number | null;

  @ApiProperty({ example: 15000, nullable: true })
  proximoMantenimientoKm: number | null;

  @ApiProperty({ example: 12000 })
  kilometrajeActual: number;

  @ApiProperty({ example: 3000, nullable: true })
  kilometrajeRestante: number | null;
}

export class PaginatedVehiculoEstadoMantenimientoResultDto {
  @ApiProperty({ type: [VehiculoEstadoMantenimientoDto] })
  data: VehiculoEstadoMantenimientoDto[];

  @ApiProperty({ example: 10 })
  total: number;
}
