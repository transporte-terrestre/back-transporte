import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { estadoViaje } from "@models/tables/viaje.model";

export class ViajeResultDto {
  @ApiProperty({ example: 1, description: "Trip ID" })
  id: number;

  @ApiProperty({ example: 1, description: "Route ID" })
  rutaId: number;

  @ApiProperty({ example: 1, description: "Vehicle ID" })
  vehiculoId: number;

  @ApiProperty({ example: 1, description: "Driver ID" })
  conductorId: number;

  @ApiProperty({
    example: "2025-01-01T10:00:00Z",
    description: "Departure date",
  })
  fechaSalida: Date;

  @ApiPropertyOptional({
    example: "2025-01-01T18:00:00Z",
    description: "Arrival date",
  })
  fechaLlegada: Date | null;

  @ApiProperty({
    enum: estadoViaje.enumValues,
    example: estadoViaje.enumValues[0],
    description: "Trip status",
  })
  estado: (typeof estadoViaje.enumValues)[number];

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
