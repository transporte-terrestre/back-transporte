import { PartialType } from "@nestjs/swagger";
import { ConductorCreateDto } from "./conductor-create.dto";

export class ConductorUpdateDto extends PartialType(ConductorCreateDto) {}
