import { ApiProperty } from '@nestjs/swagger';
import { vehiculoComentariosTipo } from '@db/tables/vehiculo-comentario.table';
import type { VehiculoComentarioTipo } from '@db/tables/vehiculo-comentario.table';

export class VehiculoComentarioResultDto {
  @ApiProperty({ example: 1, description: 'ID del comentario' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID del vehículo' })
  vehiculoId: number;

  @ApiProperty({
    example: 1,
    description: 'ID del usuario que creó el comentario',
  })
  usuarioId: number;

  @ApiProperty({
    example: 'El vehículo necesita revisión',
    description: 'Texto del comentario',
  })
  comentario: string;

  @ApiProperty({
    enum: vehiculoComentariosTipo.enumValues,
    description: 'Tipo de comentario',
    example: 'observacion',
  })
  tipo: VehiculoComentarioTipo;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Fecha de creación',
  })
  creadoEn: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Fecha de última actualización',
  })
  actualizadoEn: Date;
}
