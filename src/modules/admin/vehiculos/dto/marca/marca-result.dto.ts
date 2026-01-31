import { ApiProperty } from "@nestjs/swagger";

export class MarcaResultDto {
  @ApiProperty({ example: 1, description: "ID de la marca" })
  id: number;

  @ApiProperty({ example: "Toyota", description: "Nombre de la marca" })
  nombre: string;

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
