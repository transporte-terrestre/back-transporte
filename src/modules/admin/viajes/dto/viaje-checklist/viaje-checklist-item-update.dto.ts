import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ViajeChecklistItemUpdateDto {
  @ApiPropertyOptional({ example: true, description: 'Marcar como completado' })
  @IsBoolean()
  @IsOptional()
  completado?: boolean;

  @ApiPropertyOptional({ example: 'Sin novedad', description: 'Observación del item' })
  @IsString()
  @IsOptional()
  observacion?: string;
}
