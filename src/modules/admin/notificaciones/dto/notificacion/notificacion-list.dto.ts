import { ApiProperty } from '@nestjs/swagger';
import { notificacionTipo } from '@db/tables/notificacion.table';
import type { NotificacionTipo } from '@db/tables/notificacion.table';

export class NotificacionListDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  mensaje: string;

  @ApiProperty({
    enum: notificacionTipo.enumValues,
    default: notificacionTipo.enumValues[0],
    required: false,
  })
  tipo: NotificacionTipo;

  @ApiProperty()
  creadoEn: Date;

  @ApiProperty()
  leido: boolean;
}
