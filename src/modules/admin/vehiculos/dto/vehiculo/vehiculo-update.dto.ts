import { PartialType } from "@nestjs/swagger";
import { VehiculoCreateDto } from "./vehiculo-create.dto";

export class VehiculoUpdateDto extends PartialType(VehiculoCreateDto) {}
