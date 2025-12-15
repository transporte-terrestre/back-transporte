import { Injectable } from "@nestjs/common";
import { VehiculoRepository } from "@repository/vehiculo.repository";
import { VehiculoDocumentoRepository } from "@repository/vehiculo-documento.repository";
import { VehiculoCreateDto } from "./dto/vehiculo-create.dto";
import { VehiculoUpdateDto } from "./dto/vehiculo-update.dto";
import { PaginatedVehiculoResultDto } from "./dto/vehiculo-paginated.dto";
import {
  VehiculoDocumentoDTO,
  vehiculoDocumentosTipo,
} from "@model/tables/vehiculo-documento.model";
import { DocumentosAgrupadosVehiculoDto } from "./dto/vehiculo-result.dto";

@Injectable()
export class VehiculosService {
  constructor(
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly vehiculoDocumentoRepository: VehiculoDocumentoRepository
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string
  ): Promise<PaginatedVehiculoResultDto> {
    const { data, total } = await this.vehiculoRepository.findAllPaginated(
      page,
      limit,
      { search, fechaInicio, fechaFin }
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
    const vehiculo = await this.vehiculoRepository.findOne(id);
    const documentos = await this.vehiculoDocumentoRepository.findByVehiculoId(id);

    const documentosAgrupados = vehiculoDocumentosTipo.enumValues.reduce(
      (acc, tipo) => {
        acc[tipo] = documentos.filter((doc) => doc.tipo === tipo);
        return acc;
      },
      {} as DocumentosAgrupadosVehiculoDto
    );

    return {
      ...vehiculo,
      documentos: documentosAgrupados,
    };
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

  // ========== DOCUMENTOS ==========
  async findDocumento(id: number) {
    return await this.vehiculoDocumentoRepository.findOne(id);
  }

  async createDocumento(data: Partial<VehiculoDocumentoDTO>) {
    return await this.vehiculoDocumentoRepository.create(
      data as VehiculoDocumentoDTO
    );
  }

  async updateDocumento(id: number, data: Partial<VehiculoDocumentoDTO>) {
    return await this.vehiculoDocumentoRepository.update(id, data);
  }

  async deleteDocumento(id: number) {
    return await this.vehiculoDocumentoRepository.delete(id);
  }
}
