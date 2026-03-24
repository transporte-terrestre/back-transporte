import { ApiProperty } from '@nestjs/swagger';
import { EncargadoResultDto } from './encargado-result.dto';

export class PaginatedEncargadoResultDto {
  @ApiProperty({ type: [EncargadoResultDto] })
  data: EncargadoResultDto[];

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
