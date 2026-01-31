import { ApiProperty } from '@nestjs/swagger';
import { mantenimientoDocumentosTipo } from '@db/tables/mantenimiento-documento.table';
import type { MantenimientoDocumentoTipo } from '@db/tables/mantenimiento-documento.table';

export class MantenimientoDocumentoResultDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  mantenimientoId: number;

  @ApiProperty({
    enum: mantenimientoDocumentosTipo.enumValues,
  })
  tipo: MantenimientoDocumentoTipo;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  url: string;

  @ApiProperty({ nullable: true })
  fechaEmision: string | null;

  @ApiProperty({ nullable: true })
  fechaExpiracion: string | null;

  @ApiProperty()
  creadoEn: Date;

  @ApiProperty()
  actualizadoEn: Date;
}
