import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class TareaCreateDto {
  @ApiProperty({ example: "T-001", description: "Código de la tarea" })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({
    example: "Cambio de aceite",
    description: "Descripción de la tarea",
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
