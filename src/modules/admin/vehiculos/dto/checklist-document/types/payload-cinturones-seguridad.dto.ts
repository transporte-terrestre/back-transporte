import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested, IsString } from 'class-validator';

export class CinturonItemDto {
  @ApiProperty({ description: 'Si el asiento existe/está habilitado', default: true })
  @IsBoolean()
  habilitado: boolean;

  @ApiPropertyOptional({ description: 'Observación inicial o configuración' })
  @IsOptional()
  @IsString()
  observacion?: string;
}

export class CinturonesSeguridadDto {
  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asientoPiloto: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asientoCopiloto: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento1: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento2: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento3: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento4: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento5: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento6: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento7: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento8: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento9: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento10: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento11: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento12: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento13: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento14: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento15: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento16: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento17: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento18: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento19: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento20: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento21: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento22: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento23: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento24: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento25: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento26: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento27: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento28: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento29: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento30: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento31: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento32: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento33: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento34: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento35: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento36: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento37: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento38: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento39: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento40: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento41: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento42: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento43: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento44: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento45: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento46: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento47: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento48: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento49: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento50: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento51: CinturonItemDto;

  @ApiProperty({ type: CinturonItemDto })
  @ValidateNested()
  @Type(() => CinturonItemDto)
  asiento52: CinturonItemDto;
}
