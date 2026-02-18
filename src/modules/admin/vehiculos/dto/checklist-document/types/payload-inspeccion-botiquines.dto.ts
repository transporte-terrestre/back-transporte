import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, ValidateNested, IsString, IsNotEmpty } from 'class-validator';

export class BotiquinItemDto {
  @ApiProperty({ description: 'Si el ítem debe estar en el vehículo', default: true })
  @IsBoolean()
  habilitado: boolean;

  @ApiPropertyOptional({ description: 'Fecha de Vencimiento actual', example: new Date().toISOString() })
  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @ApiPropertyOptional({ description: 'Fecha de Salida', example: new Date().toISOString() })
  @IsOptional()
  @IsDateString()
  fechaSalida?: string;

  @ApiPropertyOptional({ description: 'Fecha de Reposición', example: new Date().toISOString() })
  @IsOptional()
  @IsDateString()
  fechaReposicion?: string;
}

export class InspeccionBotiquinesDto {
  @ApiProperty({ type: BotiquinItemDto })
  @ValidateNested()
  @Type(() => BotiquinItemDto)
  alcohol: BotiquinItemDto;

  @ApiProperty({ type: BotiquinItemDto })
  @ValidateNested()
  @Type(() => BotiquinItemDto)
  jabonLiquido: BotiquinItemDto;

  @ApiProperty({ type: BotiquinItemDto })
  @ValidateNested()
  @Type(() => BotiquinItemDto)
  gasaEsterilizada: BotiquinItemDto;

  @ApiProperty({ type: BotiquinItemDto })
  @ValidateNested()
  @Type(() => BotiquinItemDto)
  apositoEsterilizado: BotiquinItemDto;

  @ApiProperty({ type: BotiquinItemDto })
  @ValidateNested()
  @Type(() => BotiquinItemDto)
  esparadrapo: BotiquinItemDto;

  @ApiProperty({ type: BotiquinItemDto })
  @ValidateNested()
  @Type(() => BotiquinItemDto)
  vendaElastica: BotiquinItemDto;

  @ApiProperty({ type: BotiquinItemDto })
  @ValidateNested()
  @Type(() => BotiquinItemDto)
  banditasAdhesivas: BotiquinItemDto;

  @ApiProperty({ type: BotiquinItemDto })
  @ValidateNested()
  @Type(() => BotiquinItemDto)
  tijeraPuntaRoma: BotiquinItemDto;

  @ApiProperty({ type: BotiquinItemDto })
  @ValidateNested()
  @Type(() => BotiquinItemDto)
  guantesQuirurgicos: BotiquinItemDto;

  @ApiProperty({ type: BotiquinItemDto })
  @ValidateNested()
  @Type(() => BotiquinItemDto)
  algodon: BotiquinItemDto;

  @ApiProperty({ type: BotiquinItemDto })
  @ValidateNested()
  @Type(() => BotiquinItemDto)
  maletin: BotiquinItemDto;

  @ApiProperty({ description: 'Ubicación del Botiquín', default: 'Cabina' })
  @IsString()
  @IsNotEmpty()
  ubicacionBotiquin: string;
}
