import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class VehiculoConductorResultDto {
  @ApiProperty({ example: 1, description: "Assignment ID" })
  id: number;

  @ApiProperty({ example: 1, description: "Vehicle ID" })
  vehiculoId: number;

  @ApiProperty({ example: 1, description: "Driver ID" })
  conductorId: number;

  @ApiProperty({
    example: "2025-01-01T10:00:00Z",
    description: "Assignment date",
  })
  asignadoEn: Date;

  @ApiPropertyOptional({
    example: "2025-01-01T18:00:00Z",
    description: "Unassignment date",
  })
  desasignadoEn: Date | null;

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
