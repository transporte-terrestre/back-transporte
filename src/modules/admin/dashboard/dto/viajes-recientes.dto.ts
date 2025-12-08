import { ApiProperty } from "@nestjs/swagger";

export class ViajeRecienteDto {
  @ApiProperty({ example: 1, description: "ID del viaje" })
  id: number;

  @ApiProperty({ example: "Lima - Arequipa", description: "Nombre de la ruta" })
  ruta: string;

  @ApiProperty({ example: "Juan Pérez", description: "Nombre del conductor" })
  conductor: string;

  @ApiProperty({ example: "ABC-123", description: "Placa del vehículo" })
  vehiculo: string;

  @ApiProperty({ example: "en_progreso", description: "Estado del viaje" })
  estado: string;

  @ApiProperty({ example: "2025-12-06T08:30:00Z", description: "Hora de salida" })
  fechaSalida: Date;
}

export class ViajesRecientesDto {
  @ApiProperty({ type: [ViajeRecienteDto] })
  data: ViajeRecienteDto[];
}
