import {
  IsInt,
  IsString,
  IsDateString,
  IsNotEmpty,
  IsEnum,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  MantenimientoDTO,
  tipoMantenimiento,
} from "@model/tables/mantenimiento.model";

export class MantenimientoCreateDto
  implements Omit<MantenimientoDTO, "id" | "creadoEn" | "actualizadoEn">
{
  @ApiProperty({ example: 1, description: "Vehicle ID" })
  @IsInt()
  @IsNotEmpty()
  vehiculoId: number;

  @ApiProperty({
    enum: tipoMantenimiento.enumValues,
    default: tipoMantenimiento.enumValues[0],
    description: "Maintenance type",
  })
  @IsEnum(tipoMantenimiento.enumValues)
  tipo: (typeof tipoMantenimiento.enumValues)[number];

  @ApiProperty({ example: "150.50", description: "Cost" })
  @IsString()
  @IsNotEmpty()
  costo: string;

  @ApiProperty({ example: "Cambio de aceite", description: "Description" })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: "2025-01-15", description: "Date of maintenance" })
  @IsDateString()
  fecha: string;

  @ApiProperty({ example: 55000, description: "Mileage at maintenance" })
  @IsInt()
  kilometraje: number;

  @ApiProperty({
    example: "Taller Mecanico XYZ",
    description: "Service provider",
  })
  @IsString()
  @IsNotEmpty()
  proveedor: string;
}
