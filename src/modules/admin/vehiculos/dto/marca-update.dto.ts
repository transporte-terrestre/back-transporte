import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class MarcaUpdateDto {
  @ApiPropertyOptional({ example: "Toyota", description: "Nombre de la marca" })
  @IsString()
  @IsOptional()
  nombre?: string;
}
