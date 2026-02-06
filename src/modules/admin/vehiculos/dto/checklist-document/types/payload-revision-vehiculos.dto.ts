import { ApiProperty } from '@nestjs/swagger';

export class RevisionVehiculosDto {
  @ApiProperty({ description: 'En proceso de construcción...' })
  mensaje: string;
}
