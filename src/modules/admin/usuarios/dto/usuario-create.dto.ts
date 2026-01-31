import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UsuarioDTO, usuariosRol } from '@db/tables/usuario.model';
import type { UsuarioRol } from '@db/tables/usuario.model';

export class UsuarioCreateDto implements Omit<UsuarioDTO, 'id' | 'nombreCompleto' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 'John Michael', description: 'User first names' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ example: 'Doe Smith', description: 'User last names' })
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  contrasenia: string;

  @ApiProperty({
    example: [usuariosRol.enumValues[0]],
    enum: usuariosRol.enumValues,
    description: 'User roles',
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty()
  @IsIn(usuariosRol.enumValues, { each: true })
  roles: UsuarioRol[];
}
