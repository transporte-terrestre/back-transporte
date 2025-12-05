import { PartialType } from "@nestjs/swagger";
import { RutaCreateDto } from "./ruta-create.dto";

export class RutaUpdateDto extends PartialType(RutaCreateDto) {}
