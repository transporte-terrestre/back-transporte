import { ApiProperty } from '@nestjs/swagger';

export class MantenimientoReporteEstadoDto {
  @ApiProperty({ example: 1, description: 'ID del vehículo' })
  vehiculoId: number;

  @ApiProperty({ example: 'ABC-123', description: 'Placa del vehículo' })
  placa: string;

  @ApiProperty({ example: 50000, description: 'Kilometraje actual del vehículo' })
  kilometrajeActual: number;

  @ApiProperty({ example: '2025-01-01', description: 'Fecha del último mantenimiento', nullable: true })
  ultimoMantenimientoFecha: Date | null;

  @ApiProperty({ example: 45000, description: 'Kilometraje en el último mantenimiento', nullable: true })
  ultimoMantenimientoKm: number | null;

  @ApiProperty({ example: 55000, description: 'Kilometraje programado para el próximo mantenimiento', nullable: true })
  proxMantenimientoKm: number | null;

  @ApiProperty({ example: 5000, description: 'Kilómetros restantes para el próximo mantenimiento', nullable: true })
  restante: number | null;

  @ApiProperty({ example: 'verde', description: 'Estado del mantenimiento (verde, amarillo, rojo)', enum: ['verde', 'amarillo', 'rojo', 'n/a'] })
  estado: string;
}
