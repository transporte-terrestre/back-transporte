import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConductorLoginDto {
  @ApiProperty({ example: 'xerickcua@gmail.com', description: 'Email del conductor' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Contraseña del conductor' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
