import { PartialType } from '@nestjs/swagger';
import { ViajeDetalleCreateDto } from './viaje-create.dto';

export class ViajeUpdateDto extends PartialType(ViajeDetalleCreateDto) {}
