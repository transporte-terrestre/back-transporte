import { PartialType } from '@nestjs/swagger';
import { PropietarioCreateDto } from './propietario-create.dto';

export class PropietarioUpdateDto extends PartialType(PropietarioCreateDto) {}
