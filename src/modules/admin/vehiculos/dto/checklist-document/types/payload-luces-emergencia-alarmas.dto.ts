import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class LucesItemDto {
  @ApiProperty({ description: 'Estado del item (Operativo SI/NO)', default: true })
  @IsBoolean()
  estado: boolean;

  @ApiProperty({ description: 'Observación o Acción Correctiva', required: false })
  @IsOptional()
  @IsString()
  observacion?: string;
}

// Definimos la estructura exacta del formulario "Luces"
export class LucesEmergenciaAlarmasDto {
  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  alarmaRetroceso: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  alarmaCinturon: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  claxon: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  lucesCabina: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  lucesSalon: LucesItemDto;

  // Luces Altas
  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  lucesAltasDerecho: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  lucesAltasIzquierdo: LucesItemDto;

  // Luces Bajas
  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  lucesBajasDerecho: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  lucesBajasIzquierdo: LucesItemDto;

  // Luces Laterales
  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  lucesLateralesDerecho: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  lucesLateralesIzquierdo: LucesItemDto;

  // Columna Derecha
  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  lucesNeblineros: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  lucesEstacionamientoDerecho: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  lucesEstacionamientoIzquierdo: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  lucesDireccionalesDerecho: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  lucesDireccionalesIzquierdo: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  luzEstroboscopica: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  luzPertiga: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  pruebaRadio: LucesItemDto;

  @ApiProperty({ type: LucesItemDto })
  @ValidateNested()
  @Type(() => LucesItemDto)
  botonPanico: LucesItemDto;
}
