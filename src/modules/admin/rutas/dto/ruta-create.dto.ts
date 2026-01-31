import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RutaDTO } from '@db/tables/ruta.model';

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
  origenLat: string;

  @ApiProperty({ example: '-77.0428', description: 'Origin longitude' })
  @IsString()
  @IsNotEmpty()
  origenLng: string;

  @ApiProperty({ example: '-14.0678', description: 'Destination latitude' })
  @IsString()
  @IsNotEmpty()
  destinoLat: string;

  @ApiProperty({ example: '-75.7286', description: 'Destination longitude' })
  @IsString()
  @IsNotEmpty()
  destinoLng: string;

  @ApiProperty({ example: '300.5', description: 'Distance in km' })
  @IsString()
  @IsNotEmpty()
  distancia: string;

  @ApiProperty({ example: '50.0', description: 'Base cost' })
  @IsString()
  @IsNotEmpty()
  costoBase: string;
}
