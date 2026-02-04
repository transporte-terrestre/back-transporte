import { IsString, IsNotEmpty, IsIn, IsArray, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConductorDTO, conductoresClaseLicencia, conductoresCategoriaLicencia } from '@model/tables/conductor.model';
import type { ConductorCategoriaLicencia, ConductorClaseLicencia } from '@model/tables/conductor.model';

export class ConductorCreateDto implements Omit<ConductorDTO, 'id' | 'nombreCompleto' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: '12345678', description: 'Driver DNI' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ example: 'Juan Carlos', description: 'Driver first names' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ example: 'Perez Garcia', description: 'Driver last names' })
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiPropertyOptional({
    example: 'conductor@example.com',
    description: 'Driver email',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: '987654321',
    description: 'Driver phone number',
  })
  @IsString()
  @IsOptional()
  celular?: string;

  @ApiProperty({
    example: 'Q07864165',
    description: 'Driver license number',
  })
  @IsString()
  @IsNotEmpty()
  numeroLicencia: string;

  @ApiProperty({
    enum: conductoresClaseLicencia.enumValues,
    default: conductoresClaseLicencia.enumValues[0],
    description: 'Driver license class',
  })
  @IsIn(conductoresClaseLicencia.enumValues, { each: true })
  claseLicencia: ConductorClaseLicencia;

  @ApiProperty({
    enum: conductoresCategoriaLicencia.enumValues,
    default: conductoresCategoriaLicencia.enumValues[0],
    description: 'Driver license category',
  })
  @IsIn(conductoresCategoriaLicencia.enumValues, { each: true })
  categoriaLicencia: ConductorCategoriaLicencia;

  @ApiPropertyOptional({
    example: ['https://res.cloudinary.com/xxx/fotocheck.jpg'],
    description: 'Lista de URLs de fotochecks del conductor',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fotocheck?: string[];
}
