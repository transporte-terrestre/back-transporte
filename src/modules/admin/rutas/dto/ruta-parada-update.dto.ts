import { PartialType } from '@nestjs/swagger';
import { RutaParadaCreateDto } from './ruta-parada-create.dto';

export class RutaParadaUpdateDto extends PartialType(RutaParadaCreateDto) {}
