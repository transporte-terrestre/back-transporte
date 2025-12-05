import { IsString, IsNotEmpty, IsDateString, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  ConductorDTO,
  categoriaLicenciaConductor,
  claseLicenciaConductor,
} from "@models/tables/conductor.model";

export class ConductorCreateDto
  implements Omit<ConductorDTO, "id" | "creadoEn" | "actualizadoEn">
{
  @ApiProperty({ example: "12345678", description: "Driver DNI" })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ example: "Juan Perez Garcia", description: "Driver full name" })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: "Q07864165",
    description: "Driver license number",
  })
  @IsString()
  @IsNotEmpty()
  numeroLicencia: string;

  @ApiProperty({
    enum: claseLicenciaConductor.enumValues,
    default: claseLicenciaConductor.enumValues[0],
    description: "Driver license class",
  })
  @IsEnum(claseLicenciaConductor.enumValues)
  claseLicencia: (typeof claseLicenciaConductor.enumValues)[number];

  @ApiProperty({
    enum: categoriaLicenciaConductor.enumValues,
    default: categoriaLicenciaConductor.enumValues[0],
    description: "Driver license category",
  })
  @IsEnum(categoriaLicenciaConductor.enumValues)
  categoriaLicencia: (typeof categoriaLicenciaConductor.enumValues)[number];

  @ApiProperty({
    example: "2020-09-11",
    description: "License expedition date",
  })
  @IsDateString()
  fechaExpedicion: string;

  @ApiProperty({
    example: "2025-04-19",
    description: "License revalidation date",
  })
  @IsDateString()
  fechaRevalidacion: string;
}
