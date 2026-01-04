import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { conductoresClaseLicencia, conductoresCategoriaLicencia } from '@model/tables/conductor.model';
import type { ConductorClaseLicencia, ConductorCategoriaLicencia } from '@model/tables/conductor.model';

export class ConductorListDto {
  @ApiProperty({ example: 1, description: 'Driver ID' })
  id: number;

  @ApiProperty({ example: '12345678', description: 'Driver DNI' })
  dni: string;

  @ApiProperty({ example: 'Juan Carlos', description: 'Driver first names' })
  nombres: string;

  @ApiProperty({ example: 'Perez Garcia', description: 'Driver last names' })
  apellidos: string;

  @ApiProperty({
    example: 'Juan Carlos Perez Garcia',
    description: 'Driver full name',
  })
  nombreCompleto: string;

  @ApiPropertyOptional({ example: 'juan@example.com', description: 'Driver email' })
  email: string | null;

  @ApiPropertyOptional({ example: '987654321', description: 'Driver phone number' })
  celular: string | null;

  @ApiProperty({
    example: 'Q07864165',
    description: 'Driver license number',
  })
  numeroLicencia: string;

  @ApiProperty({
    enum: conductoresClaseLicencia.enumValues,
    example: conductoresClaseLicencia.enumValues[0],
    description: 'Driver license class',
  })
  claseLicencia: ConductorClaseLicencia;

  @ApiProperty({
    enum: conductoresCategoriaLicencia.enumValues,
    example: conductoresCategoriaLicencia.enumValues[0],
    description: 'Driver license category',
  })
  categoriaLicencia: ConductorCategoriaLicencia;

  @ApiPropertyOptional({
    example: ['https://res.cloudinary.com/xxx/fotocheck.jpg'],
    description: 'Lista de URLs de fotochecks del conductor',
    type: [String],
  })
  fotocheck: string[];

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  creadoEn: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Update date',
  })
  actualizadoEn: Date;
}
