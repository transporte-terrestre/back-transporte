import { ApiProperty } from "@nestjs/swagger";

export class MarcaListDto {
  @ApiProperty({ example: 1, description: "ID de la marca" })
  id: number;

  @ApiProperty({ example: "Toyota", description: "Nombre de la marca" })
  nombre: string;

  @ApiProperty({
    example: ["Corolla", "Camry", "RAV4"],
    description: "Lista de nombres de modelos de la marca",
    type: [String],
  })
  modelos: string[];

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
