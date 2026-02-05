import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChecklistItemResultDto {
  @ApiProperty({ example: 1, description: 'ID del item' })
  id: number;

  @ApiProperty({ example: 'Reporte diario', description: 'Nombre del item' })
  nombre: string;

  @ApiPropertyOptional({ example: 'Bitácora actualizada', description: 'Descripción' })
  descripcion?: string;

  @ApiProperty({ description: 'Fecha creación' })
  creadoEn: Date;

  @ApiProperty({ description: 'Fecha actualización' })
  actualizadoEn: Date;

  @ApiProperty({ description: 'Fecha eliminación' })
  eliminadoEn: Date;
}
