import { ApiProperty } from "@nestjs/swagger";

export class TareaResultDto {
  @ApiProperty({ example: 1, description: "ID de la tarea" })
  id: number;

  @ApiProperty({ example: "T-001", description: "Código de la tarea" })
  codigo: string;

  @ApiProperty({ example: "Cambio de aceite", description: "Nombre del trabajo" })
  nombreTrabajo: string;
  
  @ApiProperty({ example: "Motor", description: "Grupo de la tarea" })
  grupo: string;

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
