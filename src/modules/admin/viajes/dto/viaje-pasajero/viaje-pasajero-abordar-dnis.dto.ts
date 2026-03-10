import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ViajePasajeroAbordarDnisDto {
  @ApiProperty({
    example: ['72750623', '48485858'],
    description: 'DNIs de los pasajeros a abordar en el tramo',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  dnis: string[];
}
