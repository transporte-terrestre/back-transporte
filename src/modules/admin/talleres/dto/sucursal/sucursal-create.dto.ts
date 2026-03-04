import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SucursalDTO } from '@db/tables/sucursal.table';

export class SucursalCreateDto implements Omit<SucursalDTO, 'id' | 'creadoEn' | 'actualizadoEn' | 'eliminadoEn'> {
  @ApiProperty({
    example: 'Lima',
    description: 'Departamento de la sucursal',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  departamento: string;

  @ApiProperty({
    example: 'Lima',
    description: 'Provincia de la sucursal',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  provincia: string;

  @ApiProperty({
    example: 'San Isidro',
    description: 'Distrito de la sucursal',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  distrito: string;
}
