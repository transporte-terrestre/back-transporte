import { ApiProperty } from '@nestjs/swagger';
import { notificacionTipo } from '@db/tables/notificacion.model';
import type { NotificacionTipo } from '@db/tables/notificacion.model';

export class NotificacionResultDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Título de la notificación' })
  titulo: string;

  @ApiProperty({ example: 'Cuerpo del mensaje de la notificación' })
  mensaje: string;

  @ApiProperty({
    enum: notificacionTipo.enumValues,
    example: notificacionTipo.enumValues[0],
  })
  tipo: NotificacionTipo;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  creadoEn: Date;

  @ApiProperty({ example: false })
  leido: boolean;
}
