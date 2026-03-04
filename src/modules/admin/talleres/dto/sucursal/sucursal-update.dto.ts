import { PartialType } from '@nestjs/swagger';
import { SucursalCreateDto } from './sucursal-create.dto';

export class SucursalUpdateDto extends PartialType(SucursalCreateDto) {}
