import { ApiProperty } from "@nestjs/swagger";

export class ReporteViajesConductorDto {
  @ApiProperty()
  conductorId: number;

  @ApiProperty()
  nombreCompleto: string;

  @ApiProperty()
  dni: string;

  @ApiProperty()
  totalViajes: number;
}
