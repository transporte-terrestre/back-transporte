import { PartialType } from "@nestjs/swagger";
import { MantenimientoTareaCreateDto } from "./mantenimiento-tarea-create.dto";

export class MantenimientoTareaUpdateDto extends PartialType(
  MantenimientoTareaCreateDto
) {}
