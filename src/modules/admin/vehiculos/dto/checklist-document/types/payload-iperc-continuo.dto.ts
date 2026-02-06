import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class PhotoItemDto {
  @ApiProperty({ description: 'URL de la imagen/foto', example: 'https://image-document.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class IpercContinuoDto {
  @ApiProperty({ type: PhotoItemDto })
  @ValidateNested()
  @Type(() => PhotoItemDto)
  photo: PhotoItemDto;
}
