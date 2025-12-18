import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class ReporteQueryDto {
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
