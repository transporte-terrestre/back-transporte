import { ApiProperty, PartialType } from '@nestjs/swagger';
import { vehiculoComentariosTipo } from '@db/tables/vehiculo-comentario.table';
import type { VehiculoComentarioTipo } from '@db/tables/vehiculo-comentario.table';
import { IsOptional, IsString, IsIn } from 'class-validator';
import { VehiculoComentarioCreateDto } from './vehiculo-comentario-create.dto';

export class VehiculoComentarioUpdateDto extends PartialType(VehiculoComentarioCreateDto) {
  @ApiProperty({
    example: 'El vehículo está en buenas condiciones',
    description: 'Texto del comentario',
    required: false,
  })
  @IsString()
  @IsOptional()
  comentario?: string;

  @ApiProperty({
    enum: vehiculoComentariosTipo.enumValues,
    description: 'Tipo de comentario',
    required: false,
  })
  @IsIn(vehiculoComentariosTipo.enumValues, { each: true })
  @IsOptional()
  tipo?: VehiculoComentarioTipo;
}
