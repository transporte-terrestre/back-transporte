import { IsInt, IsString, IsNotEmpty, IsIn, IsOptional, IsDate } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import {
  MantenimientoDTO,
  mantenimientosTipo,
  mantenimientosEstado,
} from "@model/tables/mantenimiento.model";
import type {
  MantenimientoTipo,
  MantenimientoEstado,
} from "@model/tables/mantenimiento.model";

export class MantenimientoCreateDto
  implements Omit<MantenimientoDTO, "id" | "creadoEn" | "actualizadoEn">
{
  @ApiProperty({ example: 1, description: "Vehicle ID" })
  @IsInt()
  @IsNotEmpty()
  vehiculoId: number;

  @ApiProperty({ example: 1, description: "Workshop ID" })
  @IsInt()
  @IsNotEmpty()
  tallerId: number;

  @ApiProperty({ example: "ORD-001", description: "Service Order Code" })
  @IsString()
  @IsOptional()
  codigoOrden: string | null;

  @ApiProperty({
    enum: mantenimientosTipo.enumValues,
    default: mantenimientosTipo.enumValues[0],
    description: "Maintenance type",
  })
  @IsIn(mantenimientosTipo.enumValues, { each: true })
  tipo: MantenimientoTipo;

  @ApiProperty({ example: "150.50", description: "Total Cost" })
  @IsString()
  @IsNotEmpty()
  costoTotal: string;

  @ApiProperty({ example: "Cambio de aceite", description: "Description" })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    example: "2025-01-15T10:00:00Z",
    description: "Date of entry",
  })
  @IsDate()
  @Type(() => Date)
  fechaIngreso: Date;

  @ApiProperty({ example: "2025-01-16T18:00:00Z", description: "Date of exit" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaSalida: Date | null;

  @ApiProperty({ example: 55000, description: "Mileage at maintenance" })
  @IsInt()
  kilometraje: number;

  @ApiProperty({
    enum: mantenimientosEstado.enumValues,
    default: mantenimientosEstado.enumValues[0],
    description: "Status",
  })
  @IsIn(mantenimientosEstado.enumValues, { each: true })
  @IsOptional()
  estado: MantenimientoEstado;
}
