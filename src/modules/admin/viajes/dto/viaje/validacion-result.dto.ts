import { ApiProperty } from '@nestjs/swagger';

export class ValidacionResultDto {
  @ApiProperty({ description: 'Indica si la entidad (vehículo o conductor) está habilitada y disponible', example: true })
  status: boolean;

  @ApiProperty({ description: 'Mensaje detallando el resultado de la validación', example: 'El vehículo está disponible para este viaje.' })
  message: string;
}
