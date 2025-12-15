import { ApiProperty } from "@nestjs/swagger";
import { usuariosRol } from "@model/tables/usuario.model";

export class UsuarioListDto {
  @ApiProperty({ example: 1, description: "User ID" })
  id: number;

  @ApiProperty({ example: "John Michael", description: "User first names" })
  nombres: string;

  @ApiProperty({ example: "Doe Smith", description: "User last names" })
  apellidos: string;

  @ApiProperty({ example: "John Michael Doe Smith", description: "User full name" })
  nombreCompleto: string;

  @ApiProperty({ example: "john.doe@example.com", description: "User email" })
  email: string;

  @ApiProperty({
    example: [usuariosRol.enumValues[0]],
    enum: usuariosRol.enumValues,
    description: "User roles",
    isArray: true,
  })
  roles: (typeof usuariosRol.enumValues)[number][];

  @ApiProperty({
    example: [],
    description: "User fotocheck URLs",
    isArray: true,
  })
  fotocheck: string[];

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Creation date",
  })
  creadoEn: Date;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Update date",
  })
  actualizadoEn: Date;
}
