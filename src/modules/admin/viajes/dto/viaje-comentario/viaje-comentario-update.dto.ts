import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsOptional } from 'class-validator';
import { viajeComentariosTipo } from '@db/tables/viaje-comentario.table';
import type { ViajeComentarioTipo } from '@db/tables/viaje-comentario.table';

export class ViajeComentarioUpdateDto {
  @ApiProperty({
    example: 'El viaje se completó sin inconvenientes',
    description: 'Texto del comentario',
    required: false,
  })
  @IsString()
  @IsOptional()
  comentario?: string;

  @ApiProperty({
    enum: viajeComentariosTipo.enumValues,
    description: 'Tipo de comentario',
    default: viajeComentariosTipo.enumValues[0],
  })
  @IsIn(viajeComentariosTipo.enumValues, { each: true })
  @IsOptional()
  tipo: ViajeComentarioTipo;
}
