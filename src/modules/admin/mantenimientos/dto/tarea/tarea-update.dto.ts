import { PartialType } from "@nestjs/swagger";
import { TareaCreateDto } from "./tarea-create.dto";

export class TareaUpdateDto extends PartialType(TareaCreateDto) {}
