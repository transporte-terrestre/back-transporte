import { Injectable } from '@nestjs/common';
import { VehiculoRepository } from '@repository/vehiculo.repository';
import { VehiculoDocumentoRepository } from '@repository/vehiculo-documento.repository';
import { MarcaRepository } from '@repository/marca.repository';
import { ModeloRepository } from '@repository/modelo.repository';
import { VehiculoCreateDto } from './dto/vehiculo/vehiculo-create.dto';
import { VehiculoUpdateDto } from './dto/vehiculo/vehiculo-update.dto';
import { PaginatedVehiculoResultDto } from './dto/vehiculo/vehiculo-paginated.dto';
import { VehiculoDocumentoDTO, vehiculoDocumentosTipo } from '@db/tables/vehiculo-documento.table';
import { DocumentosAgrupadosVehiculoDto } from './dto/vehiculo/vehiculo-result.dto';
import { MarcaCreateDto } from './dto/marca/marca-create.dto';
import { MarcaUpdateDto } from './dto/marca/marca-update.dto';
import { ModeloCreateDto } from './dto/modelo/modelo-create.dto';
import { ModeloUpdateDto } from './dto/modelo/modelo-update.dto';

@Injectable()
export class VehiculosService {
  constructor(
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly vehiculoDocumentoRepository: VehiculoDocumentoRepository,
    private readonly marcaRepository: MarcaRepository,
    private readonly modeloRepository: ModeloRepository,
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    estado?: string,
  ): Promise<PaginatedVehiculoResultDto> {
    const { data, total } = await this.vehiculoRepository.findAllPaginated(page, limit, { search, fechaInicio, fechaFin, estado });

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

    const documentosAgrupados = vehiculoDocumentosTipo.enumValues.reduce((acc, tipo) => {
      acc[tipo] = documentos.filter((doc) => doc.tipo === tipo);
      return acc;
    }, {} as DocumentosAgrupadosVehiculoDto);

    return {
      ...vehiculo,
      documentos: documentosAgrupados,
    };
  }

  async create(data: VehiculoCreateDto) {
    const vehiculo = await this.vehiculoRepository.create(data);
    const codigoInterno = this.generarCodigoInterno(vehiculo.id);
    return this.vehiculoRepository.update(vehiculo.id, { codigoInterno });
  }

  private generarCodigoInterno(id: number): string {
    return String(id).padStart(5, '0');
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
    return await this.vehiculoDocumentoRepository.create(data as VehiculoDocumentoDTO);
  }

  async updateDocumento(id: number, data: Partial<VehiculoDocumentoDTO>) {
    return await this.vehiculoDocumentoRepository.update(id, data);
  }

  async deleteDocumento(id: number) {
    return await this.vehiculoDocumentoRepository.delete(id);
  }

  // ========== MARCAS ==========

  async findAllMarcasPaginated(page: number = 1, limit: number = 10, search?: string, fechaInicio?: string, fechaFin?: string) {
    const { data, total } = await this.marcaRepository.findAllPaginated(page, limit, { search, fechaInicio, fechaFin });

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

  async findOneMarca(id: number) {
    return await this.marcaRepository.findOne(id);
  }

  async createMarca(data: MarcaCreateDto) {
    return await this.marcaRepository.create(data);
  }

  async updateMarca(id: number, data: MarcaUpdateDto) {
    return await this.marcaRepository.update(id, data);
  }

  async deleteMarca(id: number) {
    return await this.marcaRepository.delete(id);
  }

  // ========== MODELOS ==========

  async findAllModelosPaginated(page: number = 1, limit: number = 10, search?: string, marcaId?: number, fechaInicio?: string, fechaFin?: string) {
    const { data, total } = await this.modeloRepository.findAllPaginated(page, limit, { search, marcaId, fechaInicio, fechaFin });

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

  async findOneModelo(id: number) {
    return await this.modeloRepository.findOne(id);
  }

  async createModelo(data: ModeloCreateDto) {
    return await this.modeloRepository.create(data);
  }

  async updateModelo(id: number, data: ModeloUpdateDto) {
    return await this.modeloRepository.update(id, data);
  }

  async deleteModelo(id: number) {
    return await this.modeloRepository.delete(id);
  }
}
