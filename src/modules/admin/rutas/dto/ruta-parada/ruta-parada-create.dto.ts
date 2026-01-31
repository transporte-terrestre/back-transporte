import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
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
  ubicacionLat?: string;

  @ApiPropertyOptional({ example: '-77.0428', description: 'Longitud de la ubicación' })
  @IsString()
  @IsOptional()
  ubicacionLng?: string;
}
