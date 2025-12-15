import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsInt, IsIn, IsString, IsOptional } from "class-validator";
import { ViajeComentarioDTO, viajeComentariosTipo } from "@model/tables/viaje-comentario.model";
import type { ViajeComentarioTipo } from "@model/tables/viaje-comentario.model";

export class ViajeComentarioCreateDto
  implements Omit<ViajeComentarioDTO, "id" | "creadoEn" | "actualizadoEn">
{
  @ApiProperty({ example: 1, description: "ID del viaje" })
  @IsInt()
  @IsNotEmpty()
  viajeId: number;

  @ApiProperty({ example: 1, description: "ID del usuario que crea el comentario" })
  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({
    example: "El viaje se completó sin inconvenientes",
    description: "Texto del comentario",
  })
  @IsString()
  @IsNotEmpty()
  comentario: string;

  @ApiProperty({
    enum: viajeComentariosTipo.enumValues,
    description: "Tipo de comentario",
    default: viajeComentariosTipo.enumValues[0],
    required: false,
  })
  @IsIn(viajeComentariosTipo.enumValues, { each: true })
  @IsOptional()
  tipo: ViajeComentarioTipo;
}
