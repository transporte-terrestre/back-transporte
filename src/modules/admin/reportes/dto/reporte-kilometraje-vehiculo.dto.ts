import { ApiProperty } from "@nestjs/swagger";

export class ReporteKilometrajeVehiculoDto {
  @ApiProperty()
  vehiculoId: number;

  @ApiProperty()
  placa: string;

  @ApiProperty()
  totalKilometros: number;

  @ApiProperty()
  totalViajes: number;
}
