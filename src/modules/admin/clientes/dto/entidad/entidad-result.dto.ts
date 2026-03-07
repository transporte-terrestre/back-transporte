import { ApiProperty } from '@nestjs/swagger';

export class EntidadResultDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  clienteId: number;

  @ApiProperty({ example: 'Minera Cerro Verde' })
  nombreServicio: string;

  @ApiProperty()
  creadoEn: Date;

  @ApiProperty()
  actualizadoEn: Date;
}
