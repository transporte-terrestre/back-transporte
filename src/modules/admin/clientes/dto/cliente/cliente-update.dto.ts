import { PartialType } from '@nestjs/swagger';
import { ClienteCreateDto } from './cliente-create.dto';

export class ClienteUpdateDto extends PartialType(ClienteCreateDto) {}
