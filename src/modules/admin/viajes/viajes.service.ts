import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ViajeRepository } from '@repository/viaje.repository';
import { ViajeConductorRepository } from '@repository/viaje-conductor.repository';
import { ViajeVehiculoRepository } from '@repository/viaje-vehiculo.repository';
import { ViajeComentarioRepository } from '@repository/viaje-comentario.repository';
import { ViajeServicioRepository } from '@repository/viaje-servicio.repository';
import { ChecklistItemRepository } from '@repository/checklist-item.repository';
import { ViajeChecklistRepository } from '@repository/viaje-checklist.repository';
import { RutaRepository } from '@repository/ruta.repository';
import { ClienteRepository } from '@repository/cliente.repository';
import { ViajeCreateDto } from './dto/viaje/viaje-create.dto';
import { ViajeUpdateDto } from './dto/viaje/viaje-update.dto';
import { PaginatedViajeResultDto } from './dto/viaje/viaje-paginated.dto';
import { ViajeConductorDTO } from '@db/tables/viaje-conductor.table';
import { ViajeVehiculoDTO } from '@db/tables/viaje-vehiculo.table';
import { ViajeComentarioDTO } from '@db/tables/viaje-comentario.table';
import { ViajeServicioCreateDto } from './dto/viaje-servicio/viaje-servicio-create.dto';
import { ViajeServicioUpdateDto } from './dto/viaje-servicio/viaje-servicio-update.dto';
import { ViajeChecklistCreateDto } from './dto/viaje-checklist/viaje-checklist-create.dto';
import { ViajeChecklistUpdateDto } from './dto/viaje-checklist/viaje-checklist-update.dto';
import { ViajeChecklistUpsertBodyDto } from './dto/viaje-checklist/viaje-checklist-upsert.dto';
import { ChecklistItemCreateDto } from './dto/checklist-item/checklist-item-create.dto';
import { ChecklistItemUpdateDto } from './dto/checklist-item/checklist-item-update.dto';

interface UsuarioAutenticado {
  sub: number;
  tipo: string;
}

@Injectable()
export class ViajesService {
  constructor(
    private readonly viajeRepository: ViajeRepository,
    private readonly viajeConductorRepository: ViajeConductorRepository,
    private readonly viajeVehiculoRepository: ViajeVehiculoRepository,
    private readonly viajeComentarioRepository: ViajeComentarioRepository,
    private readonly viajeServicioRepository: ViajeServicioRepository,
    private readonly checklistItemRepository: ChecklistItemRepository,
    private readonly viajeChecklistRepository: ViajeChecklistRepository,
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
    conductoresId?: number[],
    usuario?: UsuarioAutenticado,
  ): Promise<PaginatedViajeResultDto> {
    // Si el token es de un conductor, filtrar automáticamente solo sus viajes
    const conductoresFiltro = usuario?.tipo === 'conductor' ? [usuario.sub] : conductoresId;

    const { data, total } = await this.viajeRepository.findAllPaginated(page, limit, {
      search,
      fechaInicio,
      fechaFin,
      modalidadServicio,
      tipoRuta,
      estado,
      conductoresId: conductoresFiltro,
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

  // ========== CHECKLIST ITEMS (Catálogo) ==========
  async findAllChecklistItems() {
    return await this.checklistItemRepository.findAll();
  }

  async findChecklistItem(id: number) {
    const item = await this.checklistItemRepository.findOne(id);
    if (!item) {
      throw new NotFoundException(`Item de checklist con ID ${id} no encontrado`);
    }
    return item;
  }

  async createChecklistItem(data: ChecklistItemCreateDto) {
    return await this.checklistItemRepository.create(data);
  }

  async updateChecklistItem(id: number, data: ChecklistItemUpdateDto) {
    return await this.checklistItemRepository.update(id, data);
  }

  async deleteChecklistItem(id: number) {
    return await this.checklistItemRepository.delete(id);
  }

  // ========== VIAJE CHECKLISTS ==========
  async findChecklists(viajeId: number) {
    return await this.viajeChecklistRepository.findByViajeId(viajeId);
  }

  async findChecklist(checklistId: number) {
    const checklist = await this.viajeChecklistRepository.findOneWithItems(checklistId);
    if (!checklist) {
      throw new NotFoundException(`Checklist con ID ${checklistId} no encontrado`);
    }
    return checklist;
  }

  async createChecklist(viajeId: number, data: ViajeChecklistCreateDto) {
    const existente = await this.viajeChecklistRepository.findByViajeIdAndTipo(viajeId, data.tipo);
    if (existente) {
      throw new ConflictException(`Ya existe un checklist de ${data.tipo} para este viaje`);
    }

    const checklist = await this.viajeChecklistRepository.create({
      viajeId,
      tipo: data.tipo,
      observaciones: data.observaciones,
    });

    const items = await this.checklistItemRepository.findAll();

    const checklistItems = items.map((item) => ({
      viajeChecklistId: checklist.id,
      checklistItemId: item.id,
      completado: false,
    }));

    if (checklistItems.length > 0) {
      await this.viajeChecklistRepository.createManyItems(checklistItems);
    }

    return await this.viajeChecklistRepository.findOneWithItems(checklist.id);
  }

  async updateChecklist(checklistId: number, data: ViajeChecklistUpdateDto) {
    return await this.viajeChecklistRepository.update(checklistId, data);
  }

  async deleteChecklist(checklistId: number) {
    return await this.viajeChecklistRepository.delete(checklistId);
  }

  async upsertChecklist(viajeId: number, tipo: 'salida' | 'llegada', data: ViajeChecklistUpsertBodyDto, validadoPor: number) {
    let checklist = await this.viajeChecklistRepository.findByViajeIdAndTipo(viajeId, tipo);

    if (!checklist) {
      // Crear el checklist con validación automática
      checklist = await this.viajeChecklistRepository.create({
        viajeId,
        tipo,
        observaciones: data.observaciones,
        validadoPor,
        validadoEn: new Date(),
      });
    } else {
      // Actualizar checklist existente con validación
      checklist = await this.viajeChecklistRepository.update(checklist.id, {
        observaciones: data.observaciones,
        validadoPor,
        validadoEn: new Date(),
      });
    }

    // Upsert de los items
    const itemsToUpsert = data.items.map((item) => ({
      checklistItemId: item.id,
      completado: item.completado,
      observacion: item.observacion,
    }));

    await this.viajeChecklistRepository.upsertItems(checklist.id, itemsToUpsert);
    return await this.viajeChecklistRepository.findOneWithItems(checklist.id);
  }

  async findChecklistByViajeIdAndTipo(viajeId: number, tipo: 'salida' | 'llegada') {
    const checklist = await this.viajeChecklistRepository.findOneWithItemsByViajeIdAndTipo(viajeId, tipo);

    // Obtener todos los items del catálogo
    const catalogoItems = await this.checklistItemRepository.findAll();

    // Si no existe el checklist, devolver un template vacío
    if (!checklist) {
      return {
        id: null,
        viajeId,
        tipo,
        validadoPor: null,
        validadoEn: null,
        observaciones: null,
        creadoEn: null,
        actualizadoEn: null,
        items: catalogoItems.map((item) => ({
          viajeChecklistId: null,
          checklistItemId: item.id,
          completado: false,
          observacion: null,
          creadoEn: null,
          actualizadoEn: null,
          seccion: item.seccion,
          nombre: item.nombre,
          descripcion: item.descripcion,
          icono: item.icono,
          orden: item.orden,
        })),
      };
    }

    // Si existe el checklist, hacer merge con el catálogo
    const itemsExistentesMap = new Map(checklist.items.map((item) => [item.checklistItemId, item]));

    const itemsMerged = catalogoItems.map((catalogoItem) => {
      const itemExistente = itemsExistentesMap.get(catalogoItem.id);

      if (itemExistente) {
        return itemExistente;
      }

      return {
        viajeChecklistId: checklist.id,
        checklistItemId: catalogoItem.id,
        completado: false,
        observacion: null,
        creadoEn: null,
        actualizadoEn: null,
        seccion: catalogoItem.seccion,
        nombre: catalogoItem.nombre,
        descripcion: catalogoItem.descripcion,
        icono: catalogoItem.icono,
        orden: catalogoItem.orden,
      };
    });

    return {
      ...checklist,
      items: itemsMerged,
    };
  }
}
