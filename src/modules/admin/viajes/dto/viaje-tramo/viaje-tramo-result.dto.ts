import { ApiProperty } from '@nestjs/swagger';
import type { ViajeTramoTipo } from '@db/tables/viaje-tramo.table';

export class ViajeTramoResultDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  viajeId: number;

  @ApiProperty({ enum: ['origen', 'punto', 'parada', 'descanso', 'destino'] })
  tipo: ViajeTramoTipo;

  @ApiProperty({ required: false })
  longitud?: number;

  @ApiProperty({ required: false })
  latitud?: number;

  @ApiProperty({ required: false })
  nombreLugar?: string;

  @ApiProperty({ required: false })
  horaFinal?: Date;

  @ApiProperty({ required: false })
  kilometrajeFinal?: number;

  @ApiProperty({ required: false })
  numeroPasajeros?: number;

  @ApiProperty({ required: false })
  rutaParadaId?: number;

  @ApiProperty()
  creadoEn: Date;

  @ApiProperty()
  actualizadoEn: Date;
}
