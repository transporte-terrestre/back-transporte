import { ApiProperty } from "@nestjs/swagger";

export class ReporteViajesVehiculoDto {
  @ApiProperty()
  vehiculoId: number;

  @ApiProperty()
  placa: string;

  @ApiProperty()
  marca: string;

  @ApiProperty()
  modelo: string;

  @ApiProperty()
  totalViajes: number;
}
