import { ApiProperty } from "@nestjs/swagger";

export class ReporteKilometrajeVehiculoDto {
  @ApiProperty()
  vehiculoId: number;

  @ApiProperty()
  placa: string;

  @ApiProperty({ description: "Marca del vehículo" })
  marca: string;

  @ApiProperty({ description: "Modelo del vehículo" })
  modelo: string;

  @ApiProperty({ description: "Total de kilómetros estimados" })
  totalKilometrosEstimados: number;

  @ApiProperty({ description: "Total de kilómetros reales" })
  totalKilometrosReales: number;

  @ApiProperty({
    description: "Diferencia total de kilómetros (reales - estimados)",
  })
  diferenciaTotalKilometros: number;

  @ApiProperty()
  totalViajes: number;
}
