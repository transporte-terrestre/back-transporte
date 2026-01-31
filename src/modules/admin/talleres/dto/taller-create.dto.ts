import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TallerDTO, talleresTipo } from '@db/tables/taller.model';
import type { TallerTipo } from '@db/tables/taller.model';

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
    example: 'Av. Industrial 555',
    description: 'Dirección del taller',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  direccion?: string | null;
}
