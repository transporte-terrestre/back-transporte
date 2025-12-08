import { ApiProperty, PartialType } from "@nestjs/swagger";
import { UsuarioResultDto } from "@module/admin/usuarios/dto/usuario-result.dto";

export class LoginResultDto {
  @ApiProperty({ description: "JWT Access Token" })
  accessToken: string;

  @ApiProperty({ type: PartialType(UsuarioResultDto), description: "User information" })
  user: Partial<UsuarioResultDto>;
}
