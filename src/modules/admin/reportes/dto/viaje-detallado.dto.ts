import { ApiProperty } from "@nestjs/swagger";

export class ViajeDetalladoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  tipoRuta: string;

  @ApiProperty({ nullable: true })
  rutaOcasional: string | null;

  @ApiProperty({ nullable: true })
  rutaOrigen: string | null;

  @ApiProperty({ nullable: true })
  rutaDestino: string | null;

  @ApiProperty({
    nullable: true,
    description: "Distancia estimada del viaje en km",
  })
  distanciaEstimada: string | null;

  @ApiProperty({
    nullable: true,
    description: "Distancia real al final del viaje en km",
  })
  distanciaFinal: string | null;

  @ApiProperty({
    description:
      "Diferencia entre distancia final y estimada (0 si no hay valores)",
  })
  diferencia: number;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  modalidadServicio: string;

  @ApiProperty()
  fechaSalida: Date;

  @ApiProperty({ nullable: true })
  fechaLlegada: Date | null;
}
