import { ApiProperty } from "@nestjs/swagger";

export class RutaPopularDto {
  @ApiProperty({ example: "Lima - Arequipa", description: "Nombre de la ruta" })
  nombre: string;

  @ApiProperty({ example: 45, description: "Número de viajes" })
  viajes: number;

  @ApiProperty({ example: 85, description: "Porcentaje relativo" })
  porcentaje: number;
}

export class RutasPopularesDto {
  @ApiProperty({ type: [RutaPopularDto] })
  data: RutaPopularDto[];
}
