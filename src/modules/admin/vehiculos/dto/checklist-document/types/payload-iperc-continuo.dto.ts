import { ApiProperty } from '@nestjs/swagger';

export class IpercContinuoDto {
  @ApiProperty({ description: 'En proceso de construcción...' })
  mensaje: string;
}
