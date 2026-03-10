import { PartialType } from '@nestjs/swagger';
import { AlquilerDocumentoCreateDto } from './alquiler-documento-create.dto';

export class AlquilerDocumentoUpdateDto extends PartialType(AlquilerDocumentoCreateDto) {}
