import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsDateString,
  IsOptional,
  IsIn,
  IsArray,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { VehiculoDTO, vehiculosEstado } from "@model/tables/vehiculo.model";
import type { VehiculoEstado } from "@model/tables/vehiculo.model";

export class VehiculoCreateDto
  implements Omit<VehiculoDTO, "id" | "creadoEn" | "actualizadoEn">
{
  @ApiProperty({ example: "ABC-123", description: "Vehicle license plate" })
  @IsString()
  @IsNotEmpty()
  placa: string;

  @ApiPropertyOptional({
    example: "0582",
    description: "Internal vehicle code",
  })
  @IsString()
  @IsOptional()
  codigoInterno?: string;

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

  @ApiPropertyOptional({
    enum: vehiculosEstado.enumValues,
    description: "Vehicle status",
    default: vehiculosEstado.enumValues[0],
  })
  @IsOptional()
  @IsIn(vehiculosEstado.enumValues, { each: true })
  estado: VehiculoEstado;

  @ApiPropertyOptional({
    example: ["https://res.cloudinary.com/xxx/image.jpg"],
    description: "Lista de URLs de imágenes del vehículo",
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagenes?: string[];

  @ApiPropertyOptional({
    example: ["https://res.cloudinary.com/xxx/document.pdf"],
    description: "Lista de URLs de documentos del vehículo",
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documentos?: string[];
}
