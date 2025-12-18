import { ApiProperty } from "@nestjs/swagger";

export class MantenimientoTareaResultDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  mantenimientoId: number;

  @ApiProperty({ nullable: true })
  codigo: string | null;

  @ApiProperty({ nullable: true })
  categoria: string | null;

  @ApiProperty()
  descripcion: string;

  @ApiProperty({ nullable: true })
  responsable: string | null;

  @ApiProperty({ nullable: true })
  horaInicio: string | null;

  @ApiProperty({ nullable: true })
  horaFin: string | null;

  @ApiProperty()
  completada: boolean;

  @ApiProperty({ nullable: true })
  costoEstimado: string | null;

  @ApiProperty({ nullable: true })
  costoReal: string | null;

  @ApiProperty({ nullable: true })
  observaciones: string | null;

  @ApiProperty()
  creadoEn: Date;

  @ApiProperty()
  actualizadoEn: Date;
}
