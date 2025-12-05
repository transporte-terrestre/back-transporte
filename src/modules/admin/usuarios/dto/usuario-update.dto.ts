import { PartialType } from "@nestjs/swagger";
import { UsuarioCreateDto } from "./usuario-create.dto";

export class UsuarioUpdateDto extends PartialType(UsuarioCreateDto) {}
