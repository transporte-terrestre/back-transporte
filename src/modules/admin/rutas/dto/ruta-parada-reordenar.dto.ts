import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ParadaOrdenDto {
  @ApiProperty({ example: 1, description: 'ID de la parada' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 1, description: 'Nuevo orden de la parada' })
  @IsNumber()
  orden: number;
}

export class RutaParadaReordenarDto {
  @ApiProperty({ type: [ParadaOrdenDto], description: 'Lista de paradas con su nuevo orden' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParadaOrdenDto)
  paradas: ParadaOrdenDto[];
}
