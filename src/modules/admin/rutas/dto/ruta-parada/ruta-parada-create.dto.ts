import { IsString, IsNotEmpty, IsNumber, IsOptional, IsLatitude, IsLongitude } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RutaParadaDTO } from '@db/tables/ruta-parada.table';

export class RutaParadaCreateDto implements Omit<RutaParadaDTO, 'id' | 'rutaId' | 'orden' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 'PEIP - Educans', description: 'Nombre de la parada' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ example: '-12.0464', description: 'Latitud de la ubicación' })
  @IsString()
  @IsOptional()
  @IsLatitude({ message: 'La latitud debe estar entre -90 y 90' })
  ubicacionLat?: string;

  @ApiPropertyOptional({ example: '-77.0428', description: 'Longitud de la ubicación' })
  @IsString()
  @IsOptional()
  @IsLongitude({ message: 'La longitud debe estar entre -180 y 180' })
  ubicacionLng?: string;
  @ApiPropertyOptional({ example: 1, description: 'Orden de la parada', default: 0 })
  @IsNumber()
  @IsOptional()
  orden?: number;
}
