import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class TareaCreateDto {
  @ApiProperty({ example: "T-001", description: "Código de la tarea" })
  @IsString()
  @IsNotEmpty()
  codigo: string;
  @ApiProperty({ example: "Cambio de aceite", description: "Nombre del trabajo" })
  @IsString()
  @IsNotEmpty()
  nombreTrabajo: string;
  @ApiProperty({ example: "Motor", description: "Grupo de la tarea" })
  @IsString()
  @IsNotEmpty()
  grupo: string;
}
