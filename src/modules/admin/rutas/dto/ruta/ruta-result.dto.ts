import { ApiProperty } from '@nestjs/swagger';

export class RutaResultDto {
  @ApiProperty({ example: 1, description: 'Route ID' })
  id: number;

  @ApiProperty({ example: 'Lima', description: 'Origin city' })
  origen: string;

  @ApiProperty({ example: 'Ica', description: 'Destination city' })
  destino: string;

  @ApiProperty({ example: '-12.0464', description: 'Origin latitude' })
  origenLat: string;

  @ApiProperty({ example: '-77.0428', description: 'Origin longitude' })
  origenLng: string;

  @ApiProperty({ example: '-14.0678', description: 'Destination latitude' })
  destinoLat: string;

  @ApiProperty({ example: '-75.7286', description: 'Destination longitude' })
  destinoLng: string;

  @ApiProperty({ example: '300.5', description: 'Distance in km' })
  distancia: string;

  @ApiProperty({ example: 210, description: 'Tiempo estimado de viaje en minutos' })
  tiempoEstimado: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  creadoEn: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Update date',
  })
  actualizadoEn: Date;
}
