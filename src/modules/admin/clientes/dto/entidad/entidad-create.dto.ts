import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EntidadCreateDto {
  @ApiProperty({ example: 1, description: 'ID del cliente propietario' })
  @IsNumber()
  @IsNotEmpty()
  clienteId: number;

  @ApiProperty({ example: 'Minera Cerro Verde', description: 'Nombre del servicio o entidad' })
  @IsString()
  @IsNotEmpty()
  nombreServicio: string;
}
