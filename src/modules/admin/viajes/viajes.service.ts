import { Injectable, NotFoundException } from '@nestjs/common';
import { ViajeRepository } from '@repository/viaje.repository';
import { ViajeConductorRepository } from '@repository/viaje-conductor.repository';
import { ViajeVehiculoRepository } from '@repository/viaje-vehiculo.repository';
import { ViajeComentarioRepository } from '@repository/viaje-comentario.repository';
import { ViajeServicioRepository } from '@repository/viaje-servicio.repository';
import { RutaRepository } from '@repository/ruta.repository';
import { ClienteRepository } from '@repository/cliente.repository';
import { ViajeCreateDto } from './dto/viaje-create.dto';
import { ViajeUpdateDto } from './dto/viaje-update.dto';
import { PaginatedViajeResultDto } from './dto/viaje-paginated.dto';
import { ViajeConductorDTO } from '@db/tables/viaje-conductor.table';
import { ViajeVehiculoDTO } from '@db/tables/viaje-vehiculo.table';
import { ViajeComentarioDTO } from '@db/tables/viaje-comentario.table';
import { ViajeServicioCreateDto } from './dto/viaje-servicio-create.dto';
import { ViajeServicioUpdateDto } from './dto/viaje-servicio-update.dto';

@Injectable()
export class ViajesService {
  constructor(
    private readonly viajeRepository: ViajeRepository,
    private readonly viajeConductorRepository: ViajeConductorRepository,
    private readonly viajeVehiculoRepository: ViajeVehiculoRepository,
    private readonly viajeComentarioRepository: ViajeComentarioRepository,
    private readonly viajeServicioRepository: ViajeServicioRepository,
    private readonly rutaRepository: RutaRepository,
    private readonly clienteRepository: ClienteRepository,
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    modalidadServicio?: string,
    tipoRuta?: string,
    estado?: string,
  ): Promise<PaginatedViajeResultDto> {
    const { data, total } = await this.viajeRepository.findAllPaginated(page, limit, {
      search,
      fechaInicio,
      fechaFin,
      modalidadServicio,
      tipoRuta,
      estado,
    });

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

  async create(data: ViajeCreateDto) {
    const { conductorId, vehiculoId, ...viajeData } = data;

    if (!viajeData.horasContrato) {
      const cliente = await this.clienteRepository.findOne(viajeData.clienteId);
      if (cliente) {
        viajeData.horasContrato = cliente.horasContrato;
      }
    }

    const viaje = await this.viajeRepository.create(viajeData);

    if (conductorId) {
      await this.assignConductor({
        viajeId: viaje.id,
        conductorId,
        esPrincipal: true,
        rol: 'conductor',
      });
    }

    if (vehiculoId) {
      await this.assignVehiculo({
        viajeId: viaje.id,
        vehiculoId,
        esPrincipal: true,
        rol: 'principal',
      });
    }

    return viaje;
  }

  async update(id: number, data: ViajeUpdateDto) {
    return this.viajeRepository.update(id, data);
  }

  delete(id: number) {
    return this.viajeRepository.delete(id);
  }

  // ========== CONDUCTORES ==========
  async findConductores(viajeId: number) {
    return await this.viajeConductorRepository.findByViajeId(viajeId);
  }

  async findConductor(viajeId: number, conductorId: number) {
    return await this.viajeConductorRepository.findOne(viajeId, conductorId);
  }

  async assignConductor(data: ViajeConductorDTO) {
    return await this.viajeConductorRepository.create(data);
  }

  async updateConductor(viajeId: number, conductorId: number, data: Partial<ViajeConductorDTO>) {
    return await this.viajeConductorRepository.update(viajeId, conductorId, data);
  }

  async removeConductor(viajeId: number, conductorId: number) {
    return await this.viajeConductorRepository.delete(viajeId, conductorId);
  }

  // ========== VEHÍCULOS ==========
  async findVehiculos(viajeId: number) {
    return await this.viajeVehiculoRepository.findByViajeId(viajeId);
  }

  async findVehiculo(viajeId: number, vehiculoId: number) {
    return await this.viajeVehiculoRepository.findOne(viajeId, vehiculoId);
  }

  async assignVehiculo(data: ViajeVehiculoDTO) {
    return await this.viajeVehiculoRepository.create(data);
  }

  async updateVehiculo(viajeId: number, vehiculoId: number, data: Partial<ViajeVehiculoDTO>) {
    return await this.viajeVehiculoRepository.update(viajeId, vehiculoId, data);
  }

  async removeVehiculo(viajeId: number, vehiculoId: number) {
    return await this.viajeVehiculoRepository.delete(viajeId, vehiculoId);
  }

  // ========== COMENTARIOS ==========
  async findComentarios(viajeId: number) {
    return await this.viajeComentarioRepository.findByViajeId(viajeId);
  }

  async findComentario(id: number) {
    return await this.viajeComentarioRepository.findOne(id);
  }

  async createComentario(data: ViajeComentarioDTO) {
    return await this.viajeComentarioRepository.create(data);
  }

  async updateComentario(id: number, data: Partial<ViajeComentarioDTO>) {
    return await this.viajeComentarioRepository.update(id, data);
  }

  async deleteComentario(id: number) {
    return await this.viajeComentarioRepository.delete(id);
  }

  // ========== SERVICIOS (Tramos del viaje) ==========
  async findServicios(viajeId: number) {
    return await this.viajeServicioRepository.findByViajeIdWithParadas(viajeId);
  }

  async findServicio(servicioId: number) {
    const servicio = await this.viajeServicioRepository.findOne(servicioId);
    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${servicioId} no encontrado`);
    }
    return servicio;
  }

  async createServicio(viajeId: number, data: ViajeServicioCreateDto) {
    // Obtener el orden máximo actual y sumar 1
    const maxOrden = await this.viajeServicioRepository.getMaxOrden(viajeId);
    return await this.viajeServicioRepository.create({
      ...data,
      viajeId,
      orden: maxOrden + 1,
    });
  }

  async updateServicio(servicioId: number, data: ViajeServicioUpdateDto) {
    return await this.viajeServicioRepository.update(servicioId, data);
  }

  async deleteServicio(servicioId: number) {
    return await this.viajeServicioRepository.delete(servicioId);
  }

  async reordenarServicios(viajeId: number, servicios: { id: number; orden: number }[]) {
    return await this.viajeServicioRepository.reordenar(viajeId, servicios);
  }
}
