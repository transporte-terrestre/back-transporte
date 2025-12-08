import { ApiProperty } from "@nestjs/swagger";

export class DashboardStatsDto {
  @ApiProperty({ example: 45, description: "Total de vehículos" })
  totalVehiculos: number;

  @ApiProperty({ example: 38, description: "Total de conductores activos" })
  conductoresActivos: number;

  @ApiProperty({ example: 24, description: "Total de viajes hoy" })
  viajesHoy: number;

  @ApiProperty({ example: 156, description: "Total de clientes" })
  totalClientes: number;

  @ApiProperty({ example: 12, description: "Cambio porcentual de vehículos" })
  cambioVehiculos: number;

  @ApiProperty({ example: 5, description: "Cambio porcentual de conductores" })
  cambioConductores: number;

  @ApiProperty({ example: 18, description: "Cambio porcentual de viajes" })
  cambioViajes: number;

  @ApiProperty({ example: 8, description: "Cambio porcentual de clientes" })
  cambioClientes: number;
}
