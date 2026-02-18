import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class KitAntiderramesDto {
  @ApiProperty({ description: 'Mazo de goma', default: true })
  @IsBoolean()
  mazoGoma: boolean;

  @ApiProperty({ description: 'Set de cuñas, tarugos, tacos, conos', default: true })
  @IsBoolean()
  setCunas: boolean;

  @ApiProperty({ description: 'Bandeja', default: true })
  @IsBoolean()
  bandeja: boolean;

  @ApiProperty({ description: 'Barreras en Tela Oleofilica', default: true })
  @IsBoolean()
  barrerasOleofilicas: boolean;

  @ApiProperty({ description: 'Cinta de seguridad color rojo', default: true })
  @IsBoolean()
  cintaRoja: boolean;

  @ApiProperty({ description: 'Cinta de seguridad color amarillo', default: true })
  @IsBoolean()
  cintaAmarilla: boolean;

  @ApiProperty({ description: 'Bolsas de color rojo de tipo industrial', default: true })
  @IsBoolean()
  bolsasRojas: boolean;

  @ApiProperty({ description: 'Paños oleofilicos de 40 cm x 50 cm', default: true })
  @IsBoolean()
  panosOleofilicos: boolean;

  @ApiProperty({ description: 'Recogedor de plástico', default: true })
  @IsBoolean()
  recogedorPlastico: boolean;

  @ApiProperty({ description: 'Manual de plan de contingencia', default: true })
  @IsBoolean()
  manualContingencia: boolean;

  @ApiProperty({ description: 'Guantes de nitrilo', default: true })
  @IsBoolean()
  guantesNitrilo: boolean;

  @ApiProperty({ description: 'Lente de seguridad', default: true })
  @IsBoolean()
  lenteSeguridad: boolean;

  @ApiProperty({ description: 'Respirador Doble Cartucho', default: true })
  @IsBoolean()
  respirador: boolean;

  @ApiProperty({ description: 'Traje tyvek resistente a hidrocarburos', default: true })
  @IsBoolean()
  trajeTyvek: boolean;

  @ApiProperty({ description: 'Botas de PVC con puntera de seguridad', default: true })
  @IsBoolean()
  botasPVC: boolean;

  @ApiProperty({ description: 'Maletín', default: true })
  @IsBoolean()
  maletin: boolean;

  @ApiProperty({ description: 'Ubicación', required: false })
  @IsOptional()
  @IsString()
  ubicacion: string;
}
