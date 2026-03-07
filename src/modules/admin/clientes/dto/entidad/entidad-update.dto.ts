import { PartialType } from '@nestjs/swagger';
import { EntidadCreateDto } from './entidad-create.dto';

export class EntidadUpdateDto extends PartialType(EntidadCreateDto) {}
