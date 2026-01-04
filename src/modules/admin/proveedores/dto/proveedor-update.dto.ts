import { PartialType } from '@nestjs/swagger';
import { ProveedorCreateDto } from './proveedor-create.dto';

export class ProveedorUpdateDto extends PartialType(ProveedorCreateDto) {}
