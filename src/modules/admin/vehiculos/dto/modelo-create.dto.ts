import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, Min } from "class-validator";

export class ModeloCreateDto {
  @ApiProperty({ example: "Corolla", description: "Nombre del modelo" })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 1, description: "ID de la marca" })
  @IsInt()
  @Min(1)
  marcaId: number;
}
