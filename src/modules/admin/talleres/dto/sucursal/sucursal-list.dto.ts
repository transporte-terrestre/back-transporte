import { ApiProperty } from '@nestjs/swagger';

export class SucursalListDto {
  @ApiProperty({ example: 1, description: 'ID de la sucursal' })
  id: number;

  @ApiProperty({ example: 'Lima', description: 'Departamento de la sucursal' })
  departamento: string;

  @ApiProperty({ example: 'Lima', description: 'Provincia' })
  provincia: string;

  @ApiProperty({ example: 'Miraflores', description: 'Distrito' })
  distrito: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Fecha de creación',
  })
  creadoEn: Date;
}
