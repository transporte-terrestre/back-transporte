import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 50, description: 'Total de elementos encontrados' })
  total: number;

  @ApiProperty({ example: 1, description: 'Página actual' })
  page: number;

  @ApiProperty({ example: 10, description: 'Cantidad de elementos por página' })
  limit: number;

  @ApiProperty({ example: 5, description: 'Total de páginas disponibles' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Indica si existe una página siguiente' })
  hasNextPage: boolean;

  @ApiProperty({ example: false, description: 'Indica si existe una página anterior' })
  hasPreviousPage: boolean;
}
