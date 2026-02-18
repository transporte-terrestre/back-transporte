import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class MarcaCreateDto {
  @ApiProperty({ example: "Toyota", description: "Nombre de la marca" })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
