import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { notificacionTipo } from '@db/tables/notificacion.table';
import type { NotificacionTipo } from '@db/tables/notificacion.table';

export class NotificacionCreateDto {
  @ApiProperty()
  @IsString()
  titulo: string;

  @ApiProperty()
  @IsString()
  mensaje: string;

  @ApiProperty({
    enum: notificacionTipo.enumValues,
    default: notificacionTipo.enumValues[0],
    required: false,
  })
  @IsIn(notificacionTipo.enumValues)
  @IsOptional()
  tipo?: NotificacionTipo;
}
