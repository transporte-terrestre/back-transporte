import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { tipoServicioEnum } from '@db/tables/viaje-servicio.table';
import type { ViajeServicioTipo } from '@db/tables/viaje-servicio.table';
import { IsOptional, IsEnum } from 'class-validator';

export class ViajeProximoTramoQueryDto {
  @ApiPropertyOptional({
    description: 'Tipo de tramo para el que se solicita sugerencia (origen, punto, parada, descanso, destino)',
    enum: tipoServicioEnum.enumValues,
  })
  @IsOptional()
  @IsEnum(tipoServicioEnum.enumValues)
  tipo?: ViajeServicioTipo;
}


export class ViajeProximoTramoResultDto {
  @ApiProperty({
    description: 'Tipo sugerido: punto, parada, descanso',
    enum: tipoServicioEnum.enumValues,
  })
  tipo: ViajeServicioTipo;

  @ApiProperty({ description: 'Nombre del lugar sugerido', nullable: true })
  nombreLugar: string | null;

  @ApiProperty({ description: 'Latitud del lugar sugerido', nullable: true })
  latitud: string | null;

  @ApiProperty({ description: 'Longitud del lugar sugerido', nullable: true })
  longitud: string | null;

  @ApiProperty({ description: 'Último kilometraje registrado' })
  ultimoKilometraje: number;

  @ApiProperty({ description: 'Última hora registrada' })
  ultimaHora: Date;

  @ApiProperty({ description: 'Última cantidad de pasajeros registrada' })
  ultimosPasajeros: number;

  @ApiProperty({ description: 'Indica si es un punto fijo de la ruta', required: false })
  esPuntoFijo?: boolean;

  @ApiProperty({ description: 'ID de la parada de la ruta sugerida', required: false, nullable: true })
  rutaParadaId?: number | null;

  @ApiProperty({ description: 'Indica si aún faltan puntos fijos por registrar' })
  faltanPuntosFijos: boolean;
}
