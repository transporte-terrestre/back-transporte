import { PartialType } from "@nestjs/swagger";
import { ViajeCreateDto } from "./viaje-create.dto";

export class ViajeUpdateDto extends PartialType(ViajeCreateDto) {}
