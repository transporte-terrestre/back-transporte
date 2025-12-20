import { ApiProperty } from "@nestjs/swagger";

export class ModeloResultDto {
  @ApiProperty({ example: 1, description: "ID del modelo" })
  id: number;

  @ApiProperty({ example: "Corolla", description: "Nombre del modelo" })
  nombre: string;

  @ApiProperty({ example: 1, description: "ID de la marca" })
  marcaId: number;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Fecha de creación",
  })
  creadoEn: Date;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Fecha de actualización",
  })
  actualizadoEn: Date;
}
