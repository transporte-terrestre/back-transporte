import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PasajeroCreateDto {
  @ApiProperty({ example: 1, description: 'ID del cliente propietario' })
  @IsNumber()
  @IsNotEmpty()
  clienteId: number;

  @ApiProperty({ example: '12345678', description: 'DNI del pasajero' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ example: 'Juan', description: 'Nombres del pasajero' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellidos del pasajero' })
  @IsString()
  @IsNotEmpty()
  apellidos: string;
}
