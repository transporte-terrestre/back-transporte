import { ApiProperty } from '@nestjs/swagger';
import { EntidadResultDto } from './entidad-result.dto';

export class PaginatedEntidadResultDto {
  @ApiProperty({ type: [EntidadResultDto] })
  data: EntidadResultDto[];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
