import { ApiProperty } from '@nestjs/swagger';
import { talleresTipo } from '@db/tables/taller.model';
import type { TallerTipo } from '@db/tables/taller.model';

export class TallerListDto {
  @ApiProperty({ example: 1, description: 'ID del taller' })
  id: number;

  @ApiProperty({ example: '12345678901', description: 'RUC del taller' })
  ruc: string | null;

  @ApiProperty({ example: 'Taller Mecánico SAC', description: 'Razón Social' })
  razonSocial: string;

  @ApiProperty({
    example: 'Taller Express',
    description: 'Nombre Comercial',
    nullable: true,
  })
  nombreComercial: string | null;

  @ApiProperty({
    enum: talleresTipo.enumValues,
    example: talleresTipo.enumValues[1],
    description: 'Tipo de taller (interno/externo)',
  })
  tipo: TallerTipo;

  @ApiProperty({
    example: '999888777',
    description: 'Teléfono',
    nullable: true,
  })
  telefono: string | null;

  @ApiProperty({
    example: 'contacto@taller.com',
    description: 'Email',
    nullable: true,
  })
  email: string | null;

  @ApiProperty({
    example: 'Av. Principal 123',
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
