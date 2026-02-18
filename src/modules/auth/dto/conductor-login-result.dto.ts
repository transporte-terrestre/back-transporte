import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ConductorResultDto } from '@module/admin/conductores/dto/conductor/conductor-result.dto';

// Clase que representa al conductor sin documentos para el login
export class ConductorLoginInfoDto extends OmitType(ConductorResultDto, ['documentos']) {}

export class ConductorLoginResultDto {
  @ApiProperty({ description: 'JWT Access Token' })
  accessToken: string;

  @ApiProperty({ type: ConductorLoginInfoDto, description: 'Información del conductor' })
  conductor: ConductorLoginInfoDto;
}
