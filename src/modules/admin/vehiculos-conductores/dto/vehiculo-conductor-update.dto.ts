import { PartialType } from "@nestjs/swagger";
import { VehiculoConductorCreateDto } from "./vehiculo-conductor-create.dto";

export class VehiculoConductorUpdateDto extends PartialType(
  VehiculoConductorCreateDto
) {}
