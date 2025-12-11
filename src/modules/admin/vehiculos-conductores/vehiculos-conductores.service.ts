import { Injectable } from "@nestjs/common";
import { VehiculoConductorRepository } from "@repository/vehiculo-conductor.repository";
import { VehiculoConductorCreateDto } from "./dto/vehiculo-conductor-create.dto";
import { VehiculoConductorUpdateDto } from "./dto/vehiculo-conductor-update.dto";
import { PaginatedVehiculoConductorResultDto } from "./dto/vehiculo-conductor-paginated.dto";

@Injectable()
export class VehiculosConductoresService {
  constructor(
    private readonly vehiculoConductorRepository: VehiculoConductorRepository
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<PaginatedVehiculoConductorResultDto> {
    const { data, total } = await this.vehiculoConductorRepository.findAllPaginated(
      page,
      limit,
      { fechaInicio, fechaFin },
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
    return this.vehiculoConductorRepository.findOne(id);
  }

  create(data: VehiculoConductorCreateDto) {
    return this.vehiculoConductorRepository.create(data);
  }

  update(id: number, data: VehiculoConductorUpdateDto) {
    return this.vehiculoConductorRepository.update(id, data);
  }

  delete(id: number) {
    return this.vehiculoConductorRepository.delete(id);
  }
}
