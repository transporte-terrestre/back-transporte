import { IsEmail, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendConductorExpirationEmailDto {
    @ApiProperty({ example: 'admin@empresa.com', description: 'Correo al que se enviará la lista' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 7, description: 'Días de anticipación para buscar vencimientos', required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    diasAnticipacion?: number;
}
