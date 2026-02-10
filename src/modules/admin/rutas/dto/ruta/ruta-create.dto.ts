import { IsString, IsNotEmpty, IsLatitude, IsLongitude, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RutaDTO } from '@db/tables/ruta.table';
import { RutaParadaCreateDto } from '../ruta-parada/ruta-parada-create.dto';

export class RutaCreateDto implements Omit<RutaDTO, 'id' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 'Lima', description: 'Origin city' })
  @IsString()
  @IsNotEmpty()
  origen: string;

  @ApiProperty({ example: 'Ica', description: 'Destination city' })
  @IsString()
  @IsNotEmpty()
  destino: string;

  @ApiProperty({ example: '-12.0464', description: 'Origin latitude' })
  @IsString()
  @IsNotEmpty()
  @IsLatitude({ message: 'La latitud de origen debe estar entre -90 y 90' })
  origenLat: string;

  @ApiProperty({ example: '-77.0428', description: 'Origin longitude' })
  @IsString()
  @IsNotEmpty()
  @IsLongitude({ message: 'La longitud de origen debe estar entre -180 y 180' })
  origenLng: string;

  @ApiProperty({ example: '-14.0678', description: 'Destination latitude' })
  @IsString()
  @IsNotEmpty()
  @IsLatitude({ message: 'La latitud de destino debe estar entre -90 y 90' })
  destinoLat: string;

  @ApiProperty({ example: '-75.7286', description: 'Destination longitude' })
  @IsString()
  @IsNotEmpty()
  @IsLongitude({ message: 'La longitud de destino debe estar entre -180 y 180' })
  destinoLng: string;

  @ApiProperty({ example: '300.5', description: 'Distance in km' })
  @IsString()
  @IsNotEmpty()
  distancia: string;

  @ApiProperty({ example: '50.0', description: 'Base cost' })
  @IsString()
  @IsNotEmpty()
  costoBase: string;

  @ApiProperty({ type: [RutaParadaCreateDto], description: 'List of stops', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RutaParadaCreateDto)
  paradas?: RutaParadaCreateDto[];
}
