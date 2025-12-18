import { IsString, IsIn, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { notificacionTipo } from "@model/tables/notificacion.model";
import type { NotificacionTipo } from "@model/tables/notificacion.model";

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
