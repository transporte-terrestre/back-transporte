import { ApiProperty } from '@nestjs/swagger';

export class ConductorInfoDto {
  @ApiProperty({ description: 'ID del conductor' })
  id: number;

  @ApiProperty({ description: 'DNI del conductor' })
  dni: string;

  @ApiProperty({ description: 'Nombres del conductor' })
  nombres: string;

  @ApiProperty({ description: 'Apellidos del conductor' })
  apellidos: string;

  @ApiProperty({ description: 'Nombre completo del conductor' })
  nombreCompleto: string;

  @ApiProperty({ description: 'Email del conductor' })
  email: string;

  @ApiProperty({ description: 'Celular del conductor' })
  celular: string;

  @ApiProperty({ description: 'Número de licencia' })
  numeroLicencia: string;

  @ApiProperty({ description: 'Clase de licencia (A o B)' })
  claseLicencia: string;

  @ApiProperty({ description: 'Categoría de licencia (Uno, Dos, Tres)' })
  categoriaLicencia: string;

  @ApiProperty({ description: 'URLs del fotocheck', type: [String] })
  fotocheck: string[];
}

export class ConductorLoginResultDto {
  @ApiProperty({ description: 'JWT Access Token' })
  accessToken: string;

  @ApiProperty({ type: ConductorInfoDto, description: 'Información del conductor' })
  conductor: ConductorInfoDto;
}
