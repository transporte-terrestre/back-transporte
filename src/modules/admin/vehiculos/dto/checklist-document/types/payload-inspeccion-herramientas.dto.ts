import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class HerramientaItemDto {
  @ApiProperty({ description: 'Habilitada para uso (SI/NO)', default: true })
  @IsBoolean()
  estado: boolean;

  @ApiProperty({ description: 'Stock actual', required: false })
  @IsOptional()
  @IsString()
  stock?: string;

  @ApiProperty({ description: 'A: Herramienta sin grasa impregnada', required: false })
  @IsOptional()
  @IsBoolean()
  criterioA?: boolean;

  @ApiProperty({ description: 'B: Empalme y conexiones', required: false })
  @IsOptional()
  @IsBoolean()
  criterioB?: boolean;

  @ApiProperty({ description: 'C: Almacenamiento adecuado', required: false })
  @IsOptional()
  @IsBoolean()
  criterioC?: boolean;

  @ApiProperty({ description: 'D: Golpes y abolladuras', required: false })
  @IsOptional()
  @IsBoolean()
  criterioD?: boolean;

  @ApiProperty({ description: 'E: Limpia y ordenada', required: false })
  @IsOptional()
  @IsBoolean()
  criterioE?: boolean;

  @ApiProperty({ description: 'F: Otro', required: false })
  @IsOptional()
  @IsBoolean()
  criterioF?: boolean;

  @ApiProperty({ description: 'Accion Correctiva', required: false })
  @IsOptional()
  @IsString()
  accionCorrectiva?: string;

  @ApiProperty({ description: 'Observación', required: false })
  @IsOptional()
  @IsString()
  observacion?: string;
}

export class InspeccionHerramientasDto {
  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  llavesMixtas: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  destornilladorEstrella: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  destornilladorPlano: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  alicate: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  llaveRuedaPalanca: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  trianguloSeguridad: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  conosPeligro: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  cableCorriente: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  eslinga: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  grilletes: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  tacosCunas: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  linterna: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  extintor: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  pico: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  medidorAire: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  varasLuminosas: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  paletaPareSiga: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  escoba: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  balde: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  cuadernoBitacora: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  gataHidraulica: HerramientaItemDto;

  @ApiProperty({ type: HerramientaItemDto })
  @ValidateNested()
  @Type(() => HerramientaItemDto)
  cajaHerramientas: HerramientaItemDto;
}
