import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RutaResultDto } from '../ruta/ruta-result.dto';

export class RutaCircuitoResultDto {
  @ApiProperty({ example: 1, description: 'ID del circuito' })
  id: number;

  @ApiProperty({ example: 'Lima - Ica', description: 'Nombre del circuito' })
  nombre: string;

  @ApiProperty({ type: RutaResultDto, description: 'Ruta de ida' })
  rutaIda: RutaResultDto;

  @ApiProperty({ type: RutaResultDto, description: 'Ruta de vuelta' })
  rutaVuelta: RutaResultDto;

  @ApiProperty({ example: true, description: 'Indica si la ruta de ida y vuelta son la misma' })
  esIgual: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Fecha de creación' })
  creadoEn: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Fecha de actualización' })
  actualizadoEn: Date;
}
