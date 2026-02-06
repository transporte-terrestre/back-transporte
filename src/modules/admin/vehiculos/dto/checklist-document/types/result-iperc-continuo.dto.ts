import { ApiProperty } from '@nestjs/swagger';

export class ResultIpercContinuoDto {
  @ApiProperty({ description: 'En proceso de construcción...' })
  mensaje: string;
}
