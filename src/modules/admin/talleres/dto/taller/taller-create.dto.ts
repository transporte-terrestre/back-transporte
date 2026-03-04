import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, IsIn, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TallerDTO, talleresTipo } from '@db/tables/taller.table';
import type { TallerTipo } from '@db/tables/taller.table';

export class SucursalTallerDto {
  @ApiProperty({ example: 1, description: 'ID de la sucursal' })
  @IsInt()
  @IsNotEmpty()
  sucursalId: number;

  @ApiProperty({ example: 'Av. Direccion Exacta 123', description: 'Direccion exacta del taller en esta sucursal' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  direccion: string;
}

export class TallerCreateDto implements Omit<TallerDTO, 'id' | 'creadoEn' | 'actualizadoEn'> {
  @ApiPropertyOptional({
    example: '20123456789',
    description: 'RUC del taller',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
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
  telefono?: string | null;

  @ApiPropertyOptional({
    example: 'contacto@taller.com',
    description: 'Email del taller',
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string | null;

  @ApiPropertyOptional({
    description: 'Lista de sucursales a vincular con su dirección',
    type: [SucursalTallerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SucursalTallerDto)
  @IsOptional()
  sucursales?: SucursalTallerDto[];
}
