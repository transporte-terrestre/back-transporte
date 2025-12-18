import { ApiProperty } from "@nestjs/swagger";
import { notificacionTipo } from "@model/tables/notificacion.model";
import type { NotificacionTipo } from "@model/tables/notificacion.model";

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
