import { ApiProperty } from "@nestjs/swagger";
import { TareaResultDto } from "./tarea-result.dto";

export class MantenimientoTareaResultDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  mantenimientoId: number;

  @ApiProperty()
  tareaId: number;

  @ApiProperty({
    type: TareaResultDto,
    description: "Datos de la tarea del catálogo",
  })
  tarea: TareaResultDto;

  @ApiProperty({ nullable: true })
  responsable: string | null;

  @ApiProperty({ nullable: true })
  horaInicio: string | null;

  @ApiProperty({ nullable: true })
  horaFin: string | null;

  @ApiProperty()
  completada: boolean;

  @ApiProperty({ nullable: true })
  observaciones: string | null;

  @ApiProperty()
  creadoEn: Date;

  @ApiProperty()
  actualizadoEn: Date;
}
