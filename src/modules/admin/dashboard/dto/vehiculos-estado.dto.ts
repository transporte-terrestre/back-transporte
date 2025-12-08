import { ApiProperty } from "@nestjs/swagger";

export class VehiculosPorEstadoItemDto {
  @ApiProperty({ example: "activo", description: "Estado del vehículo" })
  estado: string;

  @ApiProperty({ example: 28, description: "Cantidad de vehículos" })
  cantidad: number;

  @ApiProperty({ example: 62, description: "Porcentaje del total" })
  porcentaje: number;
}

export class VehiculosPorEstadoDto {
  @ApiProperty({ type: [VehiculosPorEstadoItemDto] })
  data: VehiculosPorEstadoItemDto[];
}
