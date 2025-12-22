import { Injectable, NotFoundException } from "@nestjs/common";
import { MantenimientoRepository } from "@repository/mantenimiento.repository";
import { TareaRepository } from "@repository/tarea.repository";
import { MantenimientoCreateDto } from "./dto/mantenimiento-create.dto";
import { MantenimientoUpdateDto } from "./dto/mantenimiento-update.dto";
import { PaginatedMantenimientoResultDto } from "./dto/mantenimiento-paginated.dto";
import { PaginatedTareaResultDto } from "./dto/tarea-paginated.dto";
import { TareaCreateDto } from "./dto/tarea-create.dto";
import { TareaUpdateDto } from "./dto/tarea-update.dto";

@Injectable()
export class MantenimientosService {
  constructor(
    private readonly mantenimientoRepository: MantenimientoRepository,
    private readonly tareaRepository: TareaRepository
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

  async create(data: MantenimientoCreateDto) {
    const codigoOrden = await this.generarCodigoOrden(data.vehiculoId);
    return this.mantenimientoRepository.create({ ...data, codigoOrden });
  }

  private async generarCodigoOrden(vehiculoId: number): Promise<string> {
    const placa =
      await this.mantenimientoRepository.getPlacaVehiculo(vehiculoId);

    if (!placa) {
      throw new NotFoundException(
        `Vehículo con id ${vehiculoId} no encontrado`
      );
    }

    const count =
      await this.mantenimientoRepository.countMantenimientosActivos(vehiculoId);
    const numero = count + 1;
    const numeroFormateado = String(numero).padStart(5, "0");

    return `${placa}-${numeroFormateado}`;
  }

  update(id: number, data: MantenimientoUpdateDto) {
    return this.mantenimientoRepository.update(id, data);
  }

  delete(id: number) {
    return this.mantenimientoRepository.delete(id);
  }

  // ========== MANTENIMIENTO TAREAS (relación) ==========
  createMantenimientoTarea(data: any) {
    return this.mantenimientoRepository.createTarea(data);
  }

  updateMantenimientoTarea(id: number, data: any) {
    return this.mantenimientoRepository.updateTarea(id, data);
  }

  deleteMantenimientoTarea(id: number) {
    return this.mantenimientoRepository.deleteTarea(id);
  }

  // ========== CATÁLOGO DE TAREAS ==========
  async findAllTareasPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedTareaResultDto> {
    const { data, total } = await this.tareaRepository.findAllPaginated(
      page,
      limit,
      { search }
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

  findOneTarea(id: number) {
    return this.tareaRepository.findOne(id);
  }

  createTarea(data: TareaCreateDto) {
    return this.tareaRepository.create(data);
  }

  updateTarea(id: number, data: TareaUpdateDto) {
    return this.tareaRepository.update(id, data);
  }

  deleteTarea(id: number) {
    return this.tareaRepository.delete(id);
  }

  // ========== DOCUMENTOS ==========
  createDocumento(data: any) {
    return this.mantenimientoRepository.createDocumento(data);
  }

  updateDocumento(id: number, data: any) {
    return this.mantenimientoRepository.updateDocumento(id, data);
  }

  deleteDocumento(id: number) {
    return this.mantenimientoRepository.deleteDocumento(id);
  }
}
