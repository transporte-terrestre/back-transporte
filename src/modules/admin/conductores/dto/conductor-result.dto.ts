import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  categoriaLicenciaConductor,
  claseLicenciaConductor,
} from "@models/tables/conductor.model";

export class ConductorResultDto {
  @ApiProperty({ example: 1, description: "Driver ID" })
  id: number;

  @ApiProperty({ example: "12345678", description: "Driver DNI" })
  dni: string;

  @ApiProperty({ example: "Juan Perez Garcia", description: "Driver full name" })
  nombre: string;

  @ApiProperty({
    example: "Q07864165",
    description: "Driver license number",
  })
  numeroLicencia: string;

  @ApiProperty({
    enum: claseLicenciaConductor.enumValues,
    example: claseLicenciaConductor.enumValues[0],
    description: "Driver license class",
  })
  claseLicencia: (typeof claseLicenciaConductor.enumValues)[number];

  @ApiProperty({
    enum: categoriaLicenciaConductor.enumValues,
    example: categoriaLicenciaConductor.enumValues[0],
    description: "Driver license category",
  })
  categoriaLicencia: (typeof categoriaLicenciaConductor.enumValues)[number];

  @ApiProperty({
    example: "2020-09-11",
    description: "License expedition date",
  })
  fechaExpedicion: string;

  @ApiProperty({
    example: "2025-04-19",
    description: "License revalidation date",
  })
  fechaRevalidacion: string;

  @ApiPropertyOptional({ 
    example: ["https://res.cloudinary.com/xxx/image.jpg"], 
    description: "Lista de URLs de imágenes del conductor",
    type: [String]
  })
  imagenes: string[];

  @ApiPropertyOptional({ 
    example: ["https://res.cloudinary.com/xxx/document.pdf"], 
    description: "Lista de URLs de documentos del conductor",
    type: [String]
  })
  documentos: string[];

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
