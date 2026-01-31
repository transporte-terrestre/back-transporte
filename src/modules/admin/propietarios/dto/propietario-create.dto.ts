import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropietarioDTO, propietariosTipoDocumento } from '@db/tables/propietario.model';
import type { PropietarioTipoDocumento } from '@db/tables/propietario.model';

export class PropietarioCreateDto implements Omit<PropietarioDTO, 'id' | 'nombreCompleto' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({
    description: 'Tipo de documento',
    enum: propietariosTipoDocumento.enumValues,
    default: propietariosTipoDocumento.enumValues[0],
  })
  @IsIn(propietariosTipoDocumento.enumValues, { each: true })
  @IsNotEmpty()
  tipoDocumento: PropietarioTipoDocumento;

  @ApiPropertyOptional({ example: '12345678', description: 'DNI del propietario' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  dni?: string | null;

  @ApiPropertyOptional({
    example: '20123456789',
    description: 'RUC del propietario',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  ruc?: string | null;

  @ApiPropertyOptional({
    example: 'Juan Carlos',
    description: 'Nombres del propietario',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nombres?: string | null;

  @ApiPropertyOptional({
    example: 'Pérez García',
    description: 'Apellidos del propietario',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  apellidos?: string | null;

  @ApiPropertyOptional({
    example: 'Empresa SAC',
    description: 'Razón Social del propietario',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  razonSocial?: string | null;

  @ApiPropertyOptional({
    example: 'juan.perez@example.com',
    description: 'Email del propietario',
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string | null;

  @ApiPropertyOptional({
    example: '987654321',
    description: 'Teléfono del propietario',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string | null;

  @ApiPropertyOptional({
    example: 'Av. Principal 123',
    description: 'Dirección del propietario',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  direccion?: string | null;

  @ApiPropertyOptional({
    example: ['https://res.cloudinary.com/xxx/image.jpg'],
    description: 'Lista de URLs de imágenes del propietario',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagenes?: string[];
}
