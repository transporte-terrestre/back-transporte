import { Injectable } from "@nestjs/common";
import { RutaRepository } from "@repository/ruta.repository";
import { RutaCreateDto } from "./dto/ruta-create.dto";
import { RutaUpdateDto } from "./dto/ruta-update.dto";
import { PaginatedRutaResultDto } from "./dto/ruta-paginated.dto";

@Injectable()
export class RutasService {
  constructor(private readonly rutaRepository: RutaRepository) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<PaginatedRutaResultDto> {
    const { data, total } = await this.rutaRepository.findAllPaginated(
      page,
      limit,
      { search, fechaInicio, fechaFin },
    );

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  findOne(id: number) {
    return this.rutaRepository.findOne(id);
  }

  create(data: RutaCreateDto) {
    return this.rutaRepository.create(data);
  }

  update(id: number, data: RutaUpdateDto) {
    return this.rutaRepository.update(id, data);
  }

  delete(id: number) {
    return this.rutaRepository.delete(id);
  }
}
