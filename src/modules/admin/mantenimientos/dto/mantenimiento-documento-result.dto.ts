import { ApiProperty } from "@nestjs/swagger";

export class MantenimientoDocumentoResultDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  mantenimientoId: number;

  @ApiProperty()
  tipo: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  url: string;

  @ApiProperty({ nullable: true })
  descripcion: string | null;

  @ApiProperty()
  creadoEn: Date;

  @ApiProperty()
  actualizadoEn: Date;
}
