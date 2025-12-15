import { Injectable } from "@nestjs/common";
import { ConductorRepository } from "@repository/conductor.repository";
import { ConductorDocumentoRepository } from "@repository/conductor-documento.repository";
import { ConductorCreateDto } from "./dto/conductor-create.dto";
import { ConductorUpdateDto } from "./dto/conductor-update.dto";
import { PaginatedConductorResultDto } from "./dto/conductor-paginated.dto";
import {
  ConductorDocumentoDTO,
  conductorDocumentosTipo,
} from "@model/tables/conductor-documento.model";
import { DocumentosAgrupadosConductorDto } from "./dto/conductor-result.dto";
import { ConductorDTO } from "@model/tables/conductor.model";

@Injectable()
export class ConductoresService {
  constructor(
    private readonly conductorRepository: ConductorRepository,
    private readonly conductorDocumentoRepository: ConductorDocumentoRepository
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    claseLicencia?: string,
    categoriaLicencia?: string
  ): Promise<PaginatedConductorResultDto> {
    const { data, total } = await this.conductorRepository.findAllPaginated(
      page,
      limit,
      { search, fechaInicio, fechaFin, claseLicencia, categoriaLicencia }
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
    const conductor = await this.conductorRepository.findOne(id);
    const documentos =
      await this.conductorDocumentoRepository.findByConductorId(id);

    // Agrupar documentos por tipo
    // Agrupar documentos por tipo de forma dinámica y tipada
    const documentosAgrupados = conductorDocumentosTipo.enumValues.reduce(
      (acc, tipo) => {
        acc[tipo] = documentos.filter((doc) => doc.tipo === tipo);
        return acc;
      },
      {} as DocumentosAgrupadosConductorDto
    );

    return {
      ...conductor,
      documentos: documentosAgrupados,
    };
  }

  create(data: ConductorCreateDto) {
    const nombreCompleto = `${data.nombres} ${data.apellidos}`;
    return this.conductorRepository.create({
      ...data,
      nombreCompleto,
    });
  }

  async update(id: number, data: ConductorUpdateDto) {
    const dataToUpdate: Partial<ConductorDTO> = { ...data };

    // Auto-generate nombreCompleto if nombres or apellidos are being updated
    if (data.nombres || data.apellidos) {
      const current = await this.conductorRepository.findOne(id);
      const nombres = data.nombres ?? current.nombres;
      const apellidos = data.apellidos ?? current.apellidos;
      dataToUpdate.nombreCompleto = `${nombres} ${apellidos}`;
    }

    return this.conductorRepository.update(id, dataToUpdate);
  }

  delete(id: number) {
    return this.conductorRepository.delete(id);
  }

  // ========== DOCUMENTOS ==========
  async findDocumento(id: number) {
    return await this.conductorDocumentoRepository.findOne(id);
  }

  async createDocumento(data: Partial<ConductorDocumentoDTO>) {
    return await this.conductorDocumentoRepository.create(
      data as ConductorDocumentoDTO
    );
  }

  async updateDocumento(id: number, data: Partial<ConductorDocumentoDTO>) {
    return await this.conductorDocumentoRepository.update(id, data);
  }

  async deleteDocumento(id: number) {
    return await this.conductorDocumentoRepository.delete(id);
  }
}
