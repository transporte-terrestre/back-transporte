import { ApiProperty } from '@nestjs/swagger';

export class ResumenVehiculoDto {
  @ApiProperty({ description: 'ID del vehículo' })
  vehiculoId: number;

  @ApiProperty({ description: 'Placa del vehículo' })
  placa: string;

  @ApiProperty({ description: 'Marca del vehículo' })
  marca: string;

  @ApiProperty({ description: 'Modelo del vehículo' })
  modelo: string;

  @ApiProperty({ description: 'Total de kilometraje recorrido' })
  totalKilometraje: number;

  @ApiProperty({ description: 'Total de galones abastecidos' })
  totalGalones: number;

  @ApiProperty({ description: 'Cantidad de viajes realizados' })
  cantidadViajes: number;
}
