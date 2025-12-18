import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
} from "class-validator";
import { mantenimientoDocumentosTipo } from "@model/tables/mantenimiento-documento.model";
import type { MantenimientoDocumentoTipo } from "@model/tables/mantenimiento-documento.model";

export class MantenimientoDocumentoCreateDto {
  @ApiProperty({ example: 1, description: "ID del mantenimiento" })
  @IsNumber()
  @IsNotEmpty()
  mantenimientoId: number;

  @ApiProperty({
    enum: mantenimientoDocumentosTipo.enumValues,
    example: mantenimientoDocumentosTipo.enumValues[0],
    description: "Tipo de documento",
  })
  @IsEnum(mantenimientoDocumentosTipo.enumValues)
  @IsNotEmpty()
  tipo: MantenimientoDocumentoTipo;

  @ApiProperty({ example: "Factura 001", description: "Nombre del documento" })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: "https://example.com/doc.pdf",
    description: "URL del documento",
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: "Factura de repuestos",
    description: "Descripción del documento",
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
