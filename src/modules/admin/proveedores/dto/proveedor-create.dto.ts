import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProveedorDTO, proveedoresTipoDocumento } from '@db/tables/proveedor.model';
import type { ProveedorTipoDocumento } from '@db/tables/proveedor.model';

export class ProveedorCreateDto implements Omit<ProveedorDTO, 'id' | 'nombreCompleto' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({
    description: 'Tipo de documento',
    enum: proveedoresTipoDocumento.enumValues,
    default: proveedoresTipoDocumento.enumValues[0],
  })
  @IsIn(proveedoresTipoDocumento.enumValues, { each: true })
  @IsNotEmpty()
  tipoDocumento: ProveedorTipoDocumento;

  @ApiPropertyOptional({ example: '12345678', description: 'DNI del proveedor' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  dni?: string | null;

  @ApiPropertyOptional({
    example: '20123456789',
    description: 'RUC del proveedor',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  ruc?: string | null;

  @ApiPropertyOptional({
    example: 'Juan Carlos',
    description: 'Nombres del proveedor',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nombres?: string | null;

  @ApiPropertyOptional({
    example: 'Pérez García',
    description: 'Apellidos del proveedor',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  apellidos?: string | null;

  @ApiPropertyOptional({
    example: 'Empresa SAC',
    description: 'Razón Social del proveedor',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  razonSocial?: string | null;

  @ApiPropertyOptional({
    example: 'juan.perez@example.com',
    description: 'Email del proveedor',
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string | null;

  @ApiPropertyOptional({
    example: '987654321',
    description: 'Teléfono del proveedor',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string | null;

  @ApiPropertyOptional({
    example: 'Av. Principal 123',
    description: 'Dirección del proveedor',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  direccion?: string | null;

  @ApiPropertyOptional({
    example: ['https://res.cloudinary.com/xxx/image.jpg'],
    description: 'Lista de URLs de imágenes del proveedor',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagenes?: string[];
}
