import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PasajeroItemDto {
  @IsInt()
  @IsOptional()
  pasajeroId?: number;

  @IsString()
  @IsOptional()
  dni?: string;

  @IsString()
  @IsOptional()
  nombres?: string;

  @IsString()
  @IsOptional()
  apellidos?: string;

  @IsBoolean()
  asistencia: boolean;
}

export class ViajePasajeroFillDto {
  @ApiProperty({
    example: [
      { pasajeroId: 1, asistencia: true },
      { pasajeroId: 2, asistencia: false },
    ],
    description: 'Lista de pasajeros con su estado de asistencia',
    type: [PasajeroItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PasajeroItemDto)
  @IsNotEmpty()
  pasajeros: PasajeroItemDto[];
}
