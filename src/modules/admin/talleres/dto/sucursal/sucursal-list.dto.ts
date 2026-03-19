import { ApiProperty } from '@nestjs/swagger';

export class SucursalListDto {
  @ApiProperty({ example: 1, description: 'ID de la sucursal' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID del taller al que pertenece' })
  tallerId: number;

  @ApiProperty({ example: 'Miraflores', description: 'Distrito' })
  distrito: string;

  @ApiProperty({ example: 'Av. Larco 123', description: 'Ubicación exacta' })
  ubicacionExacta: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Fecha de creación',
  })
  creadoEn: Date;
}
