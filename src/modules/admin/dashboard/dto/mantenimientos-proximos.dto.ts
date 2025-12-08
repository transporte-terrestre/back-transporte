import { ApiProperty } from "@nestjs/swagger";

export class MantenimientoProximoDto {
  @ApiProperty({ example: "ABC-123", description: "Placa del vehículo" })
  vehiculo: string;

  @ApiProperty({ example: "Revisión técnica", description: "Tipo de mantenimiento" })
  tipo: string;

  @ApiProperty({ example: "2025-12-10", description: "Fecha programada" })
  fecha: string;

  @ApiProperty({ example: 4, description: "Días hasta el mantenimiento" })
  dias: number;

  @ApiProperty({ example: "alta", description: "Prioridad del mantenimiento" })
  prioridad: string;
}

export class MantenimientosProximosDto {
  @ApiProperty({ type: [MantenimientoProximoDto] })
  data: MantenimientoProximoDto[];
}
