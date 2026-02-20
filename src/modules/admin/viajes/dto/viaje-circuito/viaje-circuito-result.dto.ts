import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ViajeListDto } from '../viaje/viaje-list.dto';
import { ViajeLightResultDto } from '../viaje/viaje-light-result.dto';

export class ViajeCircuitoResultDto {
  @ApiProperty({ example: 1, description: 'ID del circuito de viaje' })
  id: number;

  @ApiPropertyOptional({ type: ViajeListDto, description: 'Viaje de ida' })
  ida?: ViajeListDto | null;

  @ApiPropertyOptional({ type: ViajeListDto, description: 'Viaje de vuelta' })
  vuelta?: ViajeListDto | null;

  @ApiProperty({ example: '2025-01-01T10:00:00Z', description: 'Fecha de creación' })
  creadoEn: Date;
}

export class ViajeCircuitoLightResultDto {
  @ApiProperty({ example: 1, description: 'ID del circuito de viaje' })
  id: number;

  @ApiPropertyOptional({ type: ViajeLightResultDto, description: 'Viaje de ida (ligero)' })
  ida?: ViajeLightResultDto | null;

  @ApiPropertyOptional({ type: ViajeLightResultDto, description: 'Viaje de vuelta (ligero)' })
  vuelta?: ViajeLightResultDto | null;

  @ApiProperty({ example: '2025-01-01T10:00:00Z', description: 'Fecha de creación' })
  creadoEn: Date;
}
