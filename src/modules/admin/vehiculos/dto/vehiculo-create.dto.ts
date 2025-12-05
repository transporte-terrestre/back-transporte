import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsDateString,
  IsOptional,
  IsEnum,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { VehiculoDTO, estadoVehiculo } from "@models/tables/vehiculo.model";

export class VehiculoCreateDto
  implements Omit<VehiculoDTO, "id" | "creadoEn" | "actualizadoEn">
{
  @ApiProperty({ example: "ABC-123", description: "Vehicle license plate" })
  @IsString()
  @IsNotEmpty()
  placa: string;

  @ApiProperty({ example: "Toyota", description: "Vehicle brand" })
  @IsString()
  @IsNotEmpty()
  marca: string;

  @ApiProperty({ example: "Corolla", description: "Vehicle model" })
  @IsString()
  @IsNotEmpty()
  modelo: string;

  @ApiProperty({ example: 2020, description: "Manufacturing year" })
  @IsInt()
  @Min(1900)
  anio: number;

  @ApiProperty({ example: 50000, description: "Current mileage" })
  @IsInt()
  @Min(0)
  kilometraje: number;

  @ApiProperty({ example: "2025-12-31", description: "SOAT expiration date" })
  @IsDateString()
  fechaVencimientoSoat: string;

  @ApiPropertyOptional({
    enum: estadoVehiculo.enumValues,
    description: "Vehicle status",
    default: estadoVehiculo.enumValues[0],
  })
  @IsOptional()
  @IsEnum(estadoVehiculo.enumValues)
  estado: (typeof estadoVehiculo.enumValues)[number];
}
