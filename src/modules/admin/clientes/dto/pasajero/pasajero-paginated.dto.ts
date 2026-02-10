import { ApiProperty } from '@nestjs/swagger';
import { PasajeroResultDto } from './pasajero-result.dto';

export class PaginatedPasajeroResultDto {
  @ApiProperty({ type: [PasajeroResultDto] })
  data: PasajeroResultDto[];

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
