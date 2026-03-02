import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SucursalDTO } from '@db/tables/sucursal.table';

export class SucursalCreateDto implements Omit<SucursalDTO, 'id' | 'creadoEn' | 'actualizadoEn' | 'eliminadoEn'> {
  @ApiProperty({
    example: 'Sucursal Principal',
    description: 'Nombre de la sucursal',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nombre: string;

  @ApiPropertyOptional({
    example: 'Av. Industrial 555',
    description: 'Dirección de la sucursal',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  direccion?: string | null;
}
