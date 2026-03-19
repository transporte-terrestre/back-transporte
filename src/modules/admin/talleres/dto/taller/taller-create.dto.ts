import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, IsIn, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TallerDTO, talleresTipo } from '@db/tables/taller.table';
import type { TallerTipo } from '@db/tables/taller.table';

export class TallerSucursalNestedDto {
  @ApiProperty({ example: 'San Isidro', description: 'Distrito de la sucursal' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  distrito: string;

  @ApiProperty({ example: 'Av. Juan de Arona 123', description: 'Ubicación exacta de la sucursal' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  ubicacionExacta: string;
}

export class TallerCreateDto implements Omit<TallerDTO, 'id' | 'creadoEn' | 'actualizadoEn'> {
  @ApiPropertyOptional({
    example: '20123456789',
    description: 'RUC del taller',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Transform(({ value }) => (value === '' ? null : value))
  ruc?: string | null;

  @ApiProperty({
    example: 'Taller Mecánico SAC',
    description: 'Razón Social del taller',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  razonSocial: string;

  @ApiPropertyOptional({
    example: 'Taller Express',
    description: 'Nombre Comercial del taller',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  @Transform(({ value }) => (value === '' ? null : value))
  nombreComercial?: string | null;

  @ApiProperty({
    enum: talleresTipo.enumValues,
    default: talleresTipo.enumValues[0],
    description: 'Tipo de taller (interno, externo)',
  })
  @IsIn(talleresTipo.enumValues, { each: true })
  @IsNotEmpty()
  tipo: TallerTipo;

  @ApiPropertyOptional({
    example: '987654321',
    description: 'Teléfono del taller',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Transform(({ value }) => (value === '' ? null : value))
  telefono?: string | null;

  @ApiPropertyOptional({
    example: 'contacto@taller.com',
    description: 'Email del taller',
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  @Transform(({ value }) => (value === '' ? null : value))
  email?: string | null;

  @ApiPropertyOptional({
    description: 'Lista de sucursales del taller',
    type: [TallerSucursalNestedDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TallerSucursalNestedDto)
  @IsOptional()
  sucursales?: TallerSucursalNestedDto[];
}
