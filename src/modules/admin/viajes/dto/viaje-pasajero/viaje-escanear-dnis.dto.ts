import { IsArray, IsString, IsUrl, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ViajeEscanearDnisDto {
  @ApiProperty({
    type: [String],
    description: 'Array de URLs de las imágenes de los DNIs (formato jpg, png)',
    example: ['https://ejemplo.com/dni1.jpg'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsUrl({}, { each: true, message: 'Cada elemento debe ser una URL válida' })
  urls: string[];
}
