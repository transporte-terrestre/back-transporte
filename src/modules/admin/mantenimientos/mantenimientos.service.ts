import { Injectable } from "@nestjs/common";
import { MantenimientoRepository } from "@repository/mantenimiento.repository";
import { MantenimientoCreateDto } from "./dto/mantenimiento-create.dto";
import { MantenimientoUpdateDto } from "./dto/mantenimiento-update.dto";
import { PaginatedMantenimientoResultDto } from "./dto/mantenimiento-paginated.dto";

@Injectable()
export class MantenimientosService {
  constructor(
    private readonly mantenimientoRepository: MantenimientoRepository
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    tipo?: string,
    estado?: string
  ): Promise<PaginatedMantenimientoResultDto> {
    const { data, total } = await this.mantenimientoRepository.findAllPaginated(
      page,
      limit,
      { search, fechaInicio, fechaFin, tipo, estado }
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
    return this.mantenimientoRepository.findOne(id);
  }

  create(data: MantenimientoCreateDto) {
    return this.mantenimientoRepository.create(data);
  }

  update(id: number, data: MantenimientoUpdateDto) {
    return this.mantenimientoRepository.update(id, data);
  }

  delete(id: number) {
    return this.mantenimientoRepository.delete(id);
  }
}
