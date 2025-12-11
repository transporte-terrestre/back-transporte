import { Injectable } from "@nestjs/common";
import { VehiculoRepository } from "@repository/vehiculo.repository";
import { VehiculoCreateDto } from "./dto/vehiculo-create.dto";
import { VehiculoUpdateDto } from "./dto/vehiculo-update.dto";
import { PaginatedVehiculoResultDto } from "./dto/vehiculo-paginated.dto";

@Injectable()
export class VehiculosService {
  constructor(private readonly vehiculoRepository: VehiculoRepository) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<PaginatedVehiculoResultDto> {
    const { data, total } = await this.vehiculoRepository.findAllPaginated(
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
    return this.vehiculoRepository.findOne(id);
  }

  create(data: VehiculoCreateDto) {
    return this.vehiculoRepository.create(data);
  }

  update(id: number, data: VehiculoUpdateDto) {
    return this.vehiculoRepository.update(id, data);
  }

  delete(id: number) {
    return this.vehiculoRepository.delete(id);
  }
}
