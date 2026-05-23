import { PartialType } from '@nestjs/swagger';
import { AbastecimientoCreateDto } from './abastecimiento-create.dto';

export class AbastecimientoUpdateDto extends PartialType(AbastecimientoCreateDto) {}
