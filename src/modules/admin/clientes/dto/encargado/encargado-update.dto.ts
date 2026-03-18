import { PartialType } from '@nestjs/swagger';
import { EncargadoCreateDto } from './encargado-create.dto';

export class EncargadoUpdateDto extends PartialType(EncargadoCreateDto) {}
