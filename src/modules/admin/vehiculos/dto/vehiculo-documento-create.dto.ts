import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsInt,
  IsIn,
  IsString,
  IsDateString,
  IsOptional,
} from "class-validator";
import {
  VehiculoDocumentoDTO,
  vehiculoDocumentosTipo,
} from "@model/tables/vehiculo-documento.model";
import type { VehiculoDocumentoTipo } from "@model/tables/vehiculo-documento.model";

export class VehiculoDocumentoCreateDto
  implements Omit<VehiculoDocumentoDTO, "id" | "creadoEn" | "actualizadoEn">
{
  @ApiProperty({ example: 1, description: "ID del vehículo" })
  @IsInt()
  @IsNotEmpty()
  vehiculoId: number;

  @ApiProperty({
    enum: vehiculoDocumentosTipo.enumValues,
    description: "Tipo de documento",
    default: vehiculoDocumentosTipo.enumValues[0],
  })
  @IsIn(vehiculoDocumentosTipo.enumValues, { each: true })
  @IsNotEmpty()
  tipo: VehiculoDocumentoTipo;

  @ApiProperty({ example: "Documento 1", description: "Nombre del documento" })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: "https://storage.example.com/documentos/soat-ABC123.pdf",
    description: "URL del documento",
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: "2025-12-31",
    description: "Fecha de expiración del documento",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaExpiracion?: string;

  @ApiProperty({
    example: "2023-01-15",
    description: "Fecha de emisión del documento",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaEmision?: string;
}
