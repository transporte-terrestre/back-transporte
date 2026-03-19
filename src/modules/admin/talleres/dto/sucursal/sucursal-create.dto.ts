import { IsNotEmpty, IsOptional, IsString, MaxLength, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SucursalDTO } from '@db/tables/sucursal.table';

export class SucursalCreateDto implements Omit<SucursalDTO, 'id' | 'creadoEn' | 'actualizadoEn' | 'eliminadoEn'> {
  @ApiProperty({
    example: 1,
    description: 'ID del taller al que pertenece la sucursal',
  })
  @IsInt()
  @IsNotEmpty()
  tallerId: number;

  @ApiProperty({
    example: 'San Isidro',
    description: 'Distrito de la sucursal',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  distrito: string;

  @ApiProperty({
    example: 'Av. Juan de Arona 123',
    description: 'Ubicación exacta / dirección de la sucursal',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  ubicacionExacta: string;
}
