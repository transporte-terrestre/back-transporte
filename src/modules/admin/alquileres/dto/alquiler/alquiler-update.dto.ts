import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { AlquilerCreateDto } from './alquiler-create.dto';
import { IsOptional, IsString } from 'class-validator';

export class AlquilerUpdateDto extends PartialType(AlquilerCreateDto) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  estado?: string;
}
