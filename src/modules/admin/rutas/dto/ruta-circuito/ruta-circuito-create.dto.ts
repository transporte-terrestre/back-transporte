import { IsString, IsNotEmpty, IsLatitude, IsLongitude, IsArray, IsOptional, ValidateNested, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RutaParadaCreateDto } from '../ruta-parada/ruta-parada-create.dto';

export class RutaCircuitoDetalleDto {
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
  @IsLatitude()
  origenLat: string;

  @ApiProperty({ example: '-77.0428', description: 'Longitud del origen' })
  @IsString()
  @IsNotEmpty()
  @IsLongitude()
  origenLng: string;

  @ApiProperty({ example: '-14.0678', description: 'Latitud del destino' })
  @IsString()
  @IsNotEmpty()
  @IsLatitude()
  destinoLat: string;

  @ApiProperty({ example: '-75.7286', description: 'Longitud del destino' })
  @IsString()
  @IsNotEmpty()
  @IsLongitude()
  destinoLng: string;

  @ApiProperty({ example: '300.5', description: 'Distancia en km' })
  @IsNumberString()
  @IsNotEmpty()
  distancia: string;

  @ApiProperty({ example: '50.00', description: 'Costo base' })
  @IsNumberString()
  @IsNotEmpty()
  costoBase: string;

  @ApiProperty({ type: [RutaParadaCreateDto], description: 'Lista de paradas' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RutaParadaCreateDto)
  @IsOptional()
  paradas: RutaParadaCreateDto[] = [];
}

export class RutaCircuitoCreateDto {
  @ApiProperty({ example: 'Lima - Ica', description: 'Nombre del circuito' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ type: RutaCircuitoDetalleDto, description: 'Detalle de la ruta de ida' })
  @ValidateNested()
  @Type(() => RutaCircuitoDetalleDto)
  @IsOptional()
  ida?: RutaCircuitoDetalleDto;

  @ApiPropertyOptional({ type: RutaCircuitoDetalleDto, description: 'Detalle de la ruta de vuelta (opcional)' })
  @ValidateNested()
  @Type(() => RutaCircuitoDetalleDto)
  @IsOptional()
  vuelta?: RutaCircuitoDetalleDto;
}
