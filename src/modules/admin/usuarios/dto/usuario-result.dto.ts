import { ApiProperty } from "@nestjs/swagger";
import { rolesUsuario } from "@model/tables/usuario.model";

export class UsuarioResultDto {
  @ApiProperty({ example: 1, description: "User ID" })
  id: number;

  @ApiProperty({ example: "John", description: "User first name" })
  nombre: string;

  @ApiProperty({ example: "Doe", description: "User last name" })
  apellido: string;

  @ApiProperty({ example: "john.doe@example.com", description: "User email" })
  email: string;

  @ApiProperty({
    example: [rolesUsuario.enumValues[0]],
    enum: rolesUsuario.enumValues,
    description: "User roles",
    isArray: true,
  })
  roles: (typeof rolesUsuario.enumValues)[number][];

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
