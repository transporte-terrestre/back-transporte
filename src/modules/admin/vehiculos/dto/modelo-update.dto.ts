import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class ModeloUpdateDto {
  @ApiPropertyOptional({ example: "Corolla", description: "Nombre del modelo" })
  @IsString()
  @IsOptional()
  nombre?: string;
}
