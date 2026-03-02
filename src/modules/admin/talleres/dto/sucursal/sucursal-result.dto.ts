import { ApiProperty } from '@nestjs/swagger';
import { SucursalListDto } from './sucursal-list.dto';

export class SucursalResultDto extends SucursalListDto {
  @ApiProperty({
    example: '2023-01-02T00:00:00.000Z',
    description: 'Fecha de última actualización',
  })
  actualizadoEn: Date;

  @ApiProperty({
    example: null,
    description: 'Fecha de eliminación (si aplica)',
    nullable: true,
  })
  eliminadoEn: Date | null;
}
