import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EncargadoCreateDto {
  @ApiProperty({ example: 1, description: 'ID del cliente propietario' })
  @IsNumber()
  @IsNotEmpty()
  clienteId: number;

  @ApiProperty({ example: '12345678', description: 'DNI del encargado' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ example: 'Juan', description: 'Nombres del encargado' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellidos del encargado' })
  @IsString()
  @IsNotEmpty()
  apellidos: string;
}
