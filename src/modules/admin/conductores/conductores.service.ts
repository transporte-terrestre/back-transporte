import { Injectable } from "@nestjs/common";
import { ConductorRepository } from "@repository/conductor.repository";
import { ConductorCreateDto } from "./dto/conductor-create.dto";
import { ConductorUpdateDto } from "./dto/conductor-update.dto";
import { PaginatedConductorResultDto } from "./dto/conductor-paginated.dto";

@Injectable()
export class ConductoresService {
  constructor(private readonly conductorRepository: ConductorRepository) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<PaginatedConductorResultDto> {
    const { data, total } = await this.conductorRepository.findAllPaginated(
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
    return this.conductorRepository.findOne(id);
  }

  create(data: ConductorCreateDto) {
    return this.conductorRepository.create(data);
  }

  update(id: number, data: ConductorUpdateDto) {
    return this.conductorRepository.update(id, data);
  }

  delete(id: number) {
    return this.conductorRepository.delete(id);
  }
}
