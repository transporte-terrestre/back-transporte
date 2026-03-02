import { ApiProperty } from '@nestjs/swagger';

export class SucursalListDto {
  @ApiProperty({ example: 1, description: 'ID de la sucursal' })
  id: number;

  @ApiProperty({ example: 'Sucursal Norte', description: 'Nombre de la sucursal' })
  nombre: string;

  @ApiProperty({
    example: 'Av. Norte 123',
    description: 'Dirección',
    nullable: true,
  })
  direccion: string | null;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Fecha de creación',
  })
  creadoEn: Date;
}
