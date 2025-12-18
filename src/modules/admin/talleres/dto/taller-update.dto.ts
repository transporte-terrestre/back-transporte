import { PartialType } from "@nestjs/swagger";
import { TallerCreateDto } from "./taller-create.dto";

export class TallerUpdateDto extends PartialType(TallerCreateDto) {}
