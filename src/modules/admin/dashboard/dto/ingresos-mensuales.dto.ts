import { ApiProperty } from "@nestjs/swagger";

export class IngresoMensualDto {
  @ApiProperty({ example: "Jul", description: "Mes" })
  mes: string;

  @ApiProperty({ example: 45000, description: "Monto de ingresos" })
  monto: number;
}

export class IngresosMensualesDto {
  @ApiProperty({ type: [IngresoMensualDto] })
  data: IngresoMensualDto[];
}
