import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ViajeChecklistUpdateDto {
  @ApiPropertyOptional({ example: 'Sin observaciones', description: 'Observaciones generales' })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
