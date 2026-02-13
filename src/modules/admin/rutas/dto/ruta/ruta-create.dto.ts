import { IsString, IsNotEmpty, IsLatitude, IsLongitude, IsArray, IsOptional, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RutaParadaCreateDto } from '../ruta-parada/ruta-parada-create.dto';

const SENTIDOS = ['ida', 'vuelta'] as const;
type Sentido = (typeof SENTIDOS)[number];

export class RutaCreateDto {
  @ApiProperty({ example: 'Lima - Ica', description: 'Nombre del circuito/ruta' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: SENTIDOS,
    description: 'Sentidos a crear. Si incluye ambos, se crea un circuito con ruta ida y vuelta.',
    enum: SENTIDOS,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsIn([...SENTIDOS], { each: true })
  sentidos: Sentido[];

  @ApiProperty({ example: 'Lima', description: 'Ciudad de origen' })
  @IsString()
  @IsNotEmpty()
  origen: string;

  @ApiProperty({ example: 'Ica', description: 'Ciudad de destino' })
  @IsString()
  @IsNotEmpty()
  destino: string;

  @ApiProperty({ example: '-12.0464', description: 'Latitud del origen' })
  @IsString()
  @IsNotEmpty()
  @IsLatitude({ message: 'La latitud de origen debe estar entre -90 y 90' })
  origenLat: string;

  @ApiProperty({ example: '-77.0428', description: 'Longitud del origen' })
  @IsString()
  @IsNotEmpty()
  @IsLongitude({ message: 'La longitud de origen debe estar entre -180 y 180' })
  origenLng: string;

  @ApiProperty({ example: '-14.0678', description: 'Latitud del destino' })
  @IsString()
  @IsNotEmpty()
  @IsLatitude({ message: 'La latitud de destino debe estar entre -90 y 90' })
  destinoLat: string;

  @ApiProperty({ example: '-75.7286', description: 'Longitud del destino' })
  @IsString()
  @IsNotEmpty()
  @IsLongitude({ message: 'La longitud de destino debe estar entre -180 y 180' })
  destinoLng: string;

  @ApiProperty({ example: '300.5', description: 'Distancia en km' })
  @IsString()
  @IsNotEmpty()
  distancia: string;

  @ApiProperty({ example: '50.0', description: 'Costo base' })
  @IsString()
  @IsNotEmpty()
  costoBase: string;

  @ApiPropertyOptional({ type: [RutaParadaCreateDto], description: 'Lista de paradas' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RutaParadaCreateDto)
  paradas?: RutaParadaCreateDto[];
}
