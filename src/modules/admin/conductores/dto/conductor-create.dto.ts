import { IsString, IsNotEmpty, IsIn, IsArray, IsOptional, MinLength, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConductorDTO, conductoresClaseLicencia, conductoresCategoriaLicencia } from '@db/tables/conductor.model';
import type { ConductorCategoriaLicencia, ConductorClaseLicencia } from '@db/tables/conductor.model';

export class ConductorCreateDto implements Omit<ConductorDTO, 'id' | 'nombreCompleto' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: '12345678', description: 'DNI del conductor' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ example: 'Juan Carlos', description: 'Nombres del conductor' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ example: 'Perez Garcia', description: 'Apellidos del conductor' })
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiPropertyOptional({ example: 'conductor@empresa.com', description: 'Email del conductor (requerido para login)' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'password123', description: 'Contraseña del conductor (mínimo 6 caracteres)' })
  @IsString()
  @IsOptional()
  @MinLength(6)
  contrasenia?: string;

  @ApiPropertyOptional({ example: '999888777', description: 'Celular del conductor' })
  @IsString()
  @IsOptional()
  celular?: string;

  @ApiProperty({
    example: 'Q07864165',
    description: 'Número de licencia del conductor',
  })
  @IsString()
  @IsNotEmpty()
  numeroLicencia: string;

  @ApiProperty({
    enum: conductoresClaseLicencia.enumValues,
    default: conductoresClaseLicencia.enumValues[0],
    description: 'Clase de licencia del conductor',
  })
  @IsIn(conductoresClaseLicencia.enumValues, { each: true })
  claseLicencia: ConductorClaseLicencia;

  @ApiProperty({
    enum: conductoresCategoriaLicencia.enumValues,
    default: conductoresCategoriaLicencia.enumValues[0],
    description: 'Categoría de licencia del conductor',
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
