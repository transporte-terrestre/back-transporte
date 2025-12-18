import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class ReporteDetalladoQueryDto {
  @ApiProperty({
    description: "Fecha de inicio del reporte (YYYY-MM-DD)",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiProperty({
    description: "Fecha de fin del reporte (YYYY-MM-DD)",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;
}
