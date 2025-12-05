import { PartialType } from "@nestjs/swagger";
import { MantenimientoCreateDto } from "./mantenimiento-create.dto";

export class MantenimientoUpdateDto extends PartialType(MantenimientoCreateDto) {}
