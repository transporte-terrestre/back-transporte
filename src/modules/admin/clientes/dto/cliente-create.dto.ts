import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, IsIn, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClienteDTO, clientesTipoDocumento } from '@model/tables/cliente.model';
import type { ClienteTipoDocumento } from '@model/tables/cliente.model';

export class ClienteCreateDto implements Omit<ClienteDTO, 'id' | 'nombreCompleto' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({
    description: 'Tipo de documento',
    enum: clientesTipoDocumento.enumValues,
    default: clientesTipoDocumento.enumValues[0],
  })
  @IsIn(clientesTipoDocumento.enumValues, { each: true })
  @IsNotEmpty()
  tipoDocumento: ClienteTipoDocumento;

  @ApiPropertyOptional({ example: '12345678', description: 'DNI del cliente' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  dni?: string | null;

  @ApiPropertyOptional({
    example: '20123456789',
    description: 'RUC del cliente',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  ruc?: string | null;

  @ApiPropertyOptional({
    example: 'Juan Carlos',
    description: 'Nombres del cliente',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nombres?: string | null;

  @ApiPropertyOptional({
    example: 'Pérez García',
    description: 'Apellidos del cliente',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  apellidos?: string | null;

  @ApiPropertyOptional({
    example: 'Empresa SAC',
    description: 'Razón Social del cliente',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  razonSocial?: string | null;

  @ApiPropertyOptional({
    example: 'juan.perez@example.com',
    description: 'Email del cliente',
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string | null;

  @ApiPropertyOptional({
    example: '987654321',
    description: 'Teléfono del cliente',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string | null;

  @ApiPropertyOptional({
    example: 'Av. Principal 123',
    description: 'Dirección del cliente',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  direccion?: string | null;

  @ApiPropertyOptional({
    example: '8.50',
    description: 'Horas de contrato del cliente',
  })
  @IsString()
  @IsOptional()
  horasContrato?: string;

  @ApiPropertyOptional({
    example: ['https://res.cloudinary.com/xxx/image.jpg'],
    description: 'Lista de URLs de imágenes del cliente',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagenes?: string[];
}
