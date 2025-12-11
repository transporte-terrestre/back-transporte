import { Injectable } from "@nestjs/common";
import { ClienteCreateDto } from "./dto/cliente-create.dto";
import { ClienteUpdateDto } from "./dto/cliente-update.dto";
import { ClienteRepository } from "@repository/cliente.repository";
import { PaginatedClienteResultDto } from "./dto/cliente-paginated.dto";

@Injectable()
export class ClientesService {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<PaginatedClienteResultDto> {
    const { data, total } = await this.clienteRepository.findAllPaginated(
      page,
      limit,
      {
        search,
        fechaInicio,
        fechaFin,
      },
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

  async findOne(id: number) {
    return await this.clienteRepository.findOne(id);
  }

  async create(createClienteDto: ClienteCreateDto) {
    return await this.clienteRepository.create(createClienteDto);
  }

  async update(id: number, updateClienteDto: ClienteUpdateDto) {
    return await this.clienteRepository.update(id, updateClienteDto);
  }

  async remove(id: number) {
    return await this.clienteRepository.delete(id);
  }
}
