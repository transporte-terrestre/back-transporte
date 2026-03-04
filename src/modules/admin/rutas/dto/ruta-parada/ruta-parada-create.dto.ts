import { IsString, IsNotEmpty, IsLatitude, IsLongitude, IsOptional, IsNumberString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RutaParadaCreateDto {
  @ApiProperty({ example: 'Parada 1', description: 'Nombre de la parada' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: '-12.0464', description: 'Latitud de la parada' })
  @IsString()
  @IsNotEmpty()
  @IsLatitude()
  ubicacionLat: string;

  @ApiProperty({ example: '-77.0428', description: 'Longitud de la parada' })
  @IsString()
  @IsNotEmpty()
  @IsLongitude()
  ubicacionLng: string;

  @ApiPropertyOptional({ example: 1, description: 'Orden de la parada' })
  @IsNumber()
  @IsOptional()
  orden?: number;

  @ApiPropertyOptional({ example: '10.5', description: 'Distancia desde la parada previa' })
  @IsNumberString()
  @IsOptional()
  distanciaPreviaParada?: string;

  @ApiPropertyOptional({ example: 15, description: 'Tiempo estimado desde la parada previa en minutos' })
  @IsNumber()
  @IsOptional()
  tiempoEstimado?: number;
}
