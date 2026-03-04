import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsIn, IsString, IsOptional } from 'class-validator';
import { VehiculoComentarioDTO, vehiculoComentariosTipo } from '@db/tables/vehiculo-comentario.table';
import type { VehiculoComentarioTipo } from '@db/tables/vehiculo-comentario.table';

export class VehiculoComentarioCreateDto implements Omit<VehiculoComentarioDTO, 'id' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 1, description: 'ID del vehículo' })
  @IsInt()
  @IsNotEmpty()
  vehiculoId: number;

  @ApiProperty({ example: 1, description: 'ID del usuario que crea el comentario' })
  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({
    example: 'El vehículo está en buenas condiciones',
    description: 'Texto del comentario',
  })
  @IsString()
  @IsNotEmpty()
  comentario: string;

  @ApiProperty({
    enum: vehiculoComentariosTipo.enumValues,
    description: 'Tipo de comentario',
    default: vehiculoComentariosTipo.enumValues[0],
    required: false,
  })
  @IsIn(vehiculoComentariosTipo.enumValues, { each: true })
  @IsOptional()
  tipo: VehiculoComentarioTipo;
}
