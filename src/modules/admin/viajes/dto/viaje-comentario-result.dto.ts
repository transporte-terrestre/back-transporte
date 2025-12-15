import { ApiProperty } from "@nestjs/swagger";
import { viajeComentariosTipo } from "@model/tables/viaje-comentario.model";
import type { ViajeComentarioTipo } from "@model/tables/viaje-comentario.model";

export class ViajeComentarioResultDto {
  @ApiProperty({ example: 1, description: "ID del comentario" })
  id: number;

  @ApiProperty({ example: 1, description: "ID del viaje" })
  viajeId: number;

  @ApiProperty({
    example: 1,
    description: "ID del usuario que creó el comentario",
  })
  usuarioId: number;

  @ApiProperty({
    example: "El viaje se completó sin inconvenientes",
    description: "Texto del comentario",
  })
  comentario: string;

  @ApiProperty({
    enum: viajeComentariosTipo.enumValues,
    description: "Tipo de comentario",
    example: "observacion",
  })
  tipo: ViajeComentarioTipo;

  @ApiProperty({
    example: "2024-01-15T10:30:00Z",
    description: "Fecha de creación",
  })
  creadoEn: Date;

  @ApiProperty({
    example: "2024-01-15T10:30:00Z",
    description: "Fecha de última actualización",
  })
  actualizadoEn: Date;
}
