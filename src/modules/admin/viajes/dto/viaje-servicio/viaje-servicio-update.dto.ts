import { PartialType } from '@nestjs/swagger';
import { ViajeServicioCreateDto } from './viaje-servicio-create.dto';

export class ViajeServicioUpdateDto extends PartialType(ViajeServicioCreateDto) {}
