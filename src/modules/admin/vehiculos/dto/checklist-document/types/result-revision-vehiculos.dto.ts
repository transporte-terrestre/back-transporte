import { ApiProperty } from '@nestjs/swagger';

export class ResultRevisionVehiculosDto {
  @ApiProperty({ description: 'En proceso de construcción...' })
  mensaje: string;
}
