import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ServicioOrdenDto {
  @ApiProperty({ example: 1, description: 'ID del servicio' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 1, description: 'Nuevo orden del servicio' })
  @IsNumber()
  orden: number;
}

export class ViajeServicioReordenarDto {
  @ApiProperty({ type: [ServicioOrdenDto], description: 'Lista de servicios con su nuevo orden' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServicioOrdenDto)
  servicios: ServicioOrdenDto[];
}
