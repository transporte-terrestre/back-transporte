import { Injectable } from "@nestjs/common";
import { ViajeRepository } from "@repository/viaje.repository";
import { ViajeCreateDto } from "./dto/viaje-create.dto";
import { ViajeUpdateDto } from "./dto/viaje-update.dto";
import { PaginatedViajeResultDto } from "./dto/viaje-paginated.dto";

@Injectable()
export class ViajesService {
  constructor(private readonly viajeRepository: ViajeRepository) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<PaginatedViajeResultDto> {
    const { data, total } = await this.viajeRepository.findAllPaginated(
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
    return this.viajeRepository.findOne(id);
  }

  create(data: ViajeCreateDto) {
    return this.viajeRepository.create(data);
  }

  update(id: number, data: ViajeUpdateDto) {
    return this.viajeRepository.update(id, data);
  }

  delete(id: number) {
    return this.viajeRepository.delete(id);
  }
}
