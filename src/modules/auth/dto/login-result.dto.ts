import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UsuarioResultDto } from '@module/admin/usuarios/dto/usuario/usuario-result.dto';

// Clase que representa al usuario sin documentos para el login
export class UsuarioLoginInfoDto extends OmitType(UsuarioResultDto, ['documentos']) {}

export class LoginResultDto {
  @ApiProperty({ description: 'JWT Access Token' })
  accessToken: string;

  @ApiProperty({ type: UsuarioLoginInfoDto, description: 'User information' })
  user: UsuarioLoginInfoDto;
}
