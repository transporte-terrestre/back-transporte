import { ApiProperty } from "@nestjs/swagger";
import { mantenimientosTipo } from "@model/tables/mantenimiento.model";
import type { MantenimientoTipo } from "@model/tables/mantenimiento.model";

export class MantenimientoResultDto {
  @ApiProperty({ example: 1, description: "Maintenance ID" })
  id: number;

  @ApiProperty({ example: 1, description: "Vehicle ID" })
  vehiculoId: number;

  @ApiProperty({
    enum: mantenimientosTipo.enumValues,
    example: mantenimientosTipo.enumValues[0],
    description: "Maintenance type",
  })
  tipo: MantenimientoTipo;

  @ApiProperty({ example: "150.50", description: "Cost" })
  costo: string;

  @ApiProperty({ example: "Cambio de aceite", description: "Description" })
  descripcion: string;

  @ApiProperty({ example: "2025-01-15", description: "Date of maintenance" })
  fecha: string;

  @ApiProperty({ example: 55000, description: "Mileage at maintenance" })
  kilometraje: number;

  @ApiProperty({
    example: "Taller Mecanico XYZ",
    description: "Service provider",
  })
  proveedor: string;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Creation date",
  })
  creadoEn: Date;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Update date",
  })
  actualizadoEn: Date;
}
