import { PartialType } from '@nestjs/swagger';
import { PropietarioDocumentoCreateDto } from './propietario-documento-create.dto';

export class PropietarioDocumentoUpdateDto extends PartialType(PropietarioDocumentoCreateDto) {}
