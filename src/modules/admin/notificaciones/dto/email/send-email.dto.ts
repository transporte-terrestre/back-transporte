import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
    @ApiProperty({ example: 'example@gmail.com', description: 'Correo del destinatario' })
    @IsEmail()
    @IsNotEmpty()
    to: string;

    @ApiProperty({ example: 'Asunto del correo', description: 'Asunto' })
    @IsString()
    @IsNotEmpty()
    subject: string;

    @ApiProperty({ example: 'Contenido del correo', description: 'Cuerpo del mensaje en texto plano' })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({ example: '<h1>Hola</h1>', description: 'Cuerpo del mensaje en HTML', required: false })
    @IsString()
    @IsOptional()
    html?: string;
}
