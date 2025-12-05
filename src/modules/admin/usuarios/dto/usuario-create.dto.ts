import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UsuarioDTO, rolesUsuario } from "@models/tables/usuario.model";

export class UsuarioCreateDto
  implements Omit<UsuarioDTO, "id" | "creadoEn" | "actualizadoEn">
{
  @ApiProperty({ example: "John", description: "User first name" })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: "Doe", description: "User last name" })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({ example: "john.doe@example.com", description: "User email" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "password123", description: "User password" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  contrasenia: string;

  @ApiProperty({
    example: [rolesUsuario.enumValues[0]],
    enum: rolesUsuario.enumValues,
    description: "User roles",
    isArray: true,
    default: [rolesUsuario.enumValues[0]],
  })
  @IsEnum(rolesUsuario.enumValues, { each: true })
  @IsNotEmpty()
  roles: (typeof rolesUsuario.enumValues)[number][];
}
