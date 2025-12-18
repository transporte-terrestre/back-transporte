import { PartialType } from "@nestjs/swagger";
import { MantenimientoDocumentoCreateDto } from "./mantenimiento-documento-create.dto";

export class MantenimientoDocumentoUpdateDto extends PartialType(
  MantenimientoDocumentoCreateDto
) {}
