import { PartialType } from '@nestjs/swagger';
import { PasajeroCreateDto } from './pasajero-create.dto';

export class PasajeroUpdateDto extends PartialType(PasajeroCreateDto) {}
