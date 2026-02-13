import { PartialType } from '@nestjs/swagger';
import { RutaCircuitoCreateDto } from './ruta-circuito-create.dto';

export class RutaCircuitoUpdateDto extends PartialType(RutaCircuitoCreateDto) {}
