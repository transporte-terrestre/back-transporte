import { PartialType } from '@nestjs/swagger';
import { ProveedorDocumentoCreateDto } from './proveedor-documento-create.dto';

export class ProveedorDocumentoUpdateDto extends PartialType(ProveedorDocumentoCreateDto) {}
