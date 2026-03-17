import { ApiProperty } from '@nestjs/swagger';

export class ValidacionAlquilerResultDto {
  @ApiProperty({ description: 'Indica si el vehículo está habilitado y disponible para alquiler', example: true })
  status: boolean;

  @ApiProperty({ description: 'Mensaje detallando el resultado de la validación', example: 'El vehículo está disponible para este alquiler.' })
  message: string;
}
