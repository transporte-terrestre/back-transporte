import { PartialType } from '@nestjs/swagger';
import { ChecklistItemCreateDto } from './checklist-item-create.dto';

export class ChecklistItemUpdateDto extends PartialType(ChecklistItemCreateDto) {}
