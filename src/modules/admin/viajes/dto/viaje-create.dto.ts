import { IsInt, IsEnum, IsNotEmpty, IsDate, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ViajeDTO, estadoViaje } from "@models/tables/viaje.model";

export class ViajeCreateDto
  implements Omit<ViajeDTO, "id" | "creadoEn" | "actualizadoEn">
{
  @ApiProperty({ example: 1, description: "Route ID" })
  @IsInt()
  @IsNotEmpty()
  rutaId: number;

  @ApiProperty({ example: 1, description: "Vehicle ID" })
  @IsInt()
  @IsNotEmpty()
  vehiculoId: number;

  @ApiProperty({ example: 1, description: "Driver ID" })
  @IsInt()
  @IsNotEmpty()
  conductorId: number;

  @ApiProperty({
    example: "2025-01-01T10:00:00Z",
    description: "Departure date",
  })
  @IsDate()
  @Type(() => Date)
  fechaSalida: Date;

  @ApiPropertyOptional({
    example: "2025-01-01T18:00:00Z",
    description: "Arrival date",
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaLlegada: Date | null;

  @ApiPropertyOptional({
    enum: estadoViaje.enumValues,
    description: "Trip status",
    default: estadoViaje.enumValues[0],
  })
  @IsOptional()
  @IsEnum(estadoViaje.enumValues)
  estado: (typeof estadoViaje.enumValues)[number];
}
