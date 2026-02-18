import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { VehiculoChecklistDocumentViajeTipo } from '@db/tables/vehiculo-checklist-document.table';
import { ViajeRepository } from '@repository/viaje.repository';
import { ViajeConductorRepository } from '@repository/viaje-conductor.repository';
import { ViajeVehiculoRepository } from '@repository/viaje-vehiculo.repository';
import { ViajeComentarioRepository } from '@repository/viaje-comentario.repository';
import { ViajeServicioRepository } from '@repository/viaje-servicio.repository';
import { ChecklistItemRepository } from '@repository/checklist-item.repository';
import { ViajeChecklistRepository } from '@repository/viaje-checklist.repository';
import { RutaRepository } from '@repository/ruta.repository';
import { RutaParadaRepository } from '@repository/ruta-parada.repository';
import { VehiculoRepository } from '@repository/vehiculo.repository';
import { ClienteRepository } from '@repository/cliente.repository';
import { VehiculoChecklistDocumentRepository } from '@repository/vehiculo-checklist-document.repository'; // Inyectado
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
import { ViajeChecklistResultDto, ViajeChecklistItemDetalleDto } from './dto/viaje-checklist/viaje-checklist-result.dto';
import { ViajePasajeroRepository } from '@repository/viaje-pasajero.repository';
import { ViajePasajeroFillDto } from './dto/viaje-pasajero/viaje-pasajero-fill.dto';
import { ViajePasajeroUpdateDto } from './dto/viaje-pasajero/viaje-pasajero-update.dto';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

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
    private readonly viajePasajeroRepository: ViajePasajeroRepository,
    private readonly vehiculoChecklistDocumentRepository: VehiculoChecklistDocumentRepository, // Inyectado
    private readonly rutaRepository: RutaRepository,
    private readonly rutaParadaRepository: RutaParadaRepository,
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly clienteRepository: ClienteRepository,
    private readonly notificacionesService: NotificacionesService,
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
    clienteId?: number,
    rutaId?: number,
    vehiculosId?: number[],
    sentido?: string,
    turno?: string,
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
      clienteId,
      rutaId,
      vehiculosId,
      sentido,
      turno,
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

  async findOne(id: number) {
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

  async getNextStep(viajeId: number) {
    const viaje = await this.viajeRepository.findOne(viajeId);
    if (!viaje) throw new NotFoundException('Viaje no encontrado');

    // Restricción: Solo válido para viajes con ruta fija
    if (!viaje.rutaId) {
      throw new ConflictException('Las paradas de servicio solo son válidas para viajes con ruta fija');
    }

    const servicios = await this.viajeServicioRepository.findByViajeId(viajeId);
    const paradas = await this.rutaParadaRepository.findByRutaId(viaje.rutaId);

    const nextOrden = servicios.length + 1;
    const totalSegments = Math.max(0, paradas.length - 1);

    let kmInicial = 0;
    let horaSalida = '';
    let paradaPartidaId: number | null = null;
    let paradaLlegadaId: number | null = null;
    let paradaPartidaNombre: string | null = null;
    let paradaLlegadaNombre: string | null = null;

    if (servicios.length === 0) {
      // Primer tramo
      const vehiculosAsignados = await this.viajeVehiculoRepository.findByViajeId(viajeId);
      const principal = vehiculosAsignados.find((v) => v.esPrincipal) || vehiculosAsignados[0];
      if (principal) {
        const vInfo = await this.vehiculoRepository.findOne(principal.vehiculoId);
        kmInicial = vInfo?.kilometraje || 0;
      }

      // Hora programada del viaje
      const date = new Date(viaje.fechaSalida);
      horaSalida = date.toTimeString().substring(0, 5);

      if (paradas.length >= 2) {
        paradaPartidaId = paradas[0].id;
        paradaPartidaNombre = paradas[0].nombre;
        paradaLlegadaId = paradas[1].id;
        paradaLlegadaNombre = paradas[1].nombre;
      }
    } else {
      // Siguientes tramos
      const last = servicios[servicios.length - 1];
      kmInicial = last.kmFinal || last.kmInicial;
      horaSalida = last.horaTermino || last.horaSalida;

      const nextParadaIndex = servicios.length; // Si hay 1 servicio (index 0), el siguiente usa parada index 1 y 2
      if (paradas.length > nextParadaIndex + 1) {
        paradaPartidaId = paradas[nextParadaIndex].id;
        paradaPartidaNombre = paradas[nextParadaIndex].nombre;
        paradaLlegadaId = paradas[nextParadaIndex + 1].id;
        paradaLlegadaNombre = paradas[nextParadaIndex + 1].nombre;
      } else if (paradas.length === nextParadaIndex + 1) {
        // Caso borde: estamos en la última parada pero tal vez hay un tramo extra o finalización
        paradaPartidaId = paradas[nextParadaIndex].id;
        paradaPartidaNombre = paradas[nextParadaIndex].nombre;
      }
    }

    return {
      orden: nextOrden,
      paradaPartidaId,
      paradaPartidaNombre,
      paradaLlegadaId,
      paradaLlegadaNombre,
      horaSalida,
      kmInicial,
      numeroPasajeros: null,
      progreso: totalSegments > 0 ? `${nextOrden}/${totalSegments}` : '0/0',
      isStart: nextOrden === 1,
      isFinal: nextOrden === totalSegments,
    };
  }

  async createServicio(viajeId: number, data: ViajeServicioCreateDto) {
    const viaje = await this.viajeRepository.findOne(viajeId);
    if (!viaje) throw new NotFoundException('Viaje no encontrado');

    // Restricción: Solo válido para viajes con ruta fija
    if (!viaje.rutaId) {
      throw new ConflictException('Las paradas de servicio solo son válidas para viajes con ruta fija');
    }

    const maxOrden = await this.viajeServicioRepository.getMaxOrden(viajeId);

    // Si no se manda hora de término, la ponemos automática (hora actual)
    const horaTermino = data.horaTermino || new Date().toTimeString().substring(0, 5);

    // Autollenado de nombres de paradas si se envió ID
    let paradaPartidaNombre = null;
    let paradaLlegadaNombre = null;

    if (data.paradaPartidaId) {
      const p = await this.rutaParadaRepository.findOne(data.paradaPartidaId);
      if (p) paradaPartidaNombre = p.nombre;
    }

    if (data.paradaLlegadaId) {
      const p = await this.rutaParadaRepository.findOne(data.paradaLlegadaId);
      if (p) paradaLlegadaNombre = p.nombre;
    }

    const result = await this.viajeServicioRepository.create({
      ...data,
      paradaPartidaNombre,
      paradaLlegadaNombre,
      horaTermino,
      viajeId,
      orden: maxOrden + 1,
    } as any);

    // Actualizar kilometraje del vehículo si es el principal
    if (result.kmFinal) {
      const vehiculosAsignados = await this.viajeVehiculoRepository.findByViajeId(viajeId);
      const principal = vehiculosAsignados.find((v) => v.esPrincipal) || vehiculosAsignados[0];
      if (principal) {
        await this.vehiculoRepository.update(principal.vehiculoId, {
          kilometraje: result.kmFinal,
        });
      }
    }

    return result;
  }

  async updateServicio(servicioId: number, data: ViajeServicioUpdateDto) {
    const result = await this.viajeServicioRepository.update(servicioId, data);

    // Si se actualizó el kmFinal, también actualizar el vehículo
    if (result.kmFinal) {
      const vehiculosAsignados = await this.viajeVehiculoRepository.findByViajeId(result.viajeId);
      const principal = vehiculosAsignados.find((v) => v.esPrincipal) || vehiculosAsignados[0];
      if (principal) {
        await this.vehiculoRepository.update(principal.vehiculoId, {
          kilometraje: result.kmFinal,
        });
      }
    }

    return result;
  }

  async deleteServicio(servicioId: number) {
    return await this.viajeServicioRepository.delete(servicioId);
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

    // No creamos items automáticos aquí. Los items se crean cuando se guarda la ejecución (upsert)
    // basándose en la configuración activa del vehículo.

    return await this.viajeChecklistRepository.findOneWithItems(checklist.id);
  }

  async updateChecklist(checklistId: number, data: ViajeChecklistUpdateDto) {
    return await this.viajeChecklistRepository.update(checklistId, data);
  }

  async deleteChecklist(checklistId: number) {
    return await this.viajeChecklistRepository.delete(checklistId);
  }

  async verifyChecklist(viajeId: number, tipo: VehiculoChecklistDocumentViajeTipo, validadoPor: number) {
    const current = await this.getChecklistTemplate(viajeId, tipo);

    let checklistId = current.id;

    if (!checklistId) {
      const checklist = await this.viajeChecklistRepository.create({
        viajeId,
        tipo,
        validadoPor,
        validadoEn: new Date(),
        observaciones: current.observaciones || null,
      });
      checklistId = checklist.id;
    }

    if (current.items && current.items.length > 0) {
      const itemsToSave = current.items.map((i) => ({
        checklistItemId: i.checklistItemId,
        vehiculoChecklistDocumentId: i.vehiculoChecklistDocumentId,
        observacion: i.observacion || null,
      }));

      if (itemsToSave.length > 0) {
        await this.viajeChecklistRepository.upsertItems(checklistId, itemsToSave);
      }
    }

    return await this.findChecklistByViajeIdAndTipo(viajeId, tipo);
  }

  async findChecklistByViajeIdAndTipo(viajeId: number, tipo: VehiculoChecklistDocumentViajeTipo): Promise<ViajeChecklistResultDto | null> {
    const existing = await this.viajeChecklistRepository.findOneWithItemsByViajeIdAndTipo(viajeId, tipo);
    const template = await this.getChecklistTemplate(viajeId, tipo);

    if (!template) {
      return existing || null;
    }

    return this.mergeChecklists(existing, template);
  }

  private mergeChecklists(existing: ViajeChecklistResultDto | null, template: ViajeChecklistResultDto): ViajeChecklistResultDto {
    if (!existing) return template;

    const mergedItems = template.items.map((tItem) => {
      const existingItem = existing.items.find((e) => e.checklistItemId === tItem.checklistItemId);
      return {
        ...tItem,
        observacion: existingItem ? existingItem.observacion : null,
        creadoEn: existingItem ? existingItem.creadoEn : null,
        actualizadoEn: existingItem ? existingItem.actualizadoEn : null,
      };
    });

    return {
      ...existing,
      items: mergedItems,
    };
  }

  private async getChecklistTemplate(viajeId: number, tipo: VehiculoChecklistDocumentViajeTipo): Promise<ViajeChecklistResultDto | null> {
    const vehiculos = await this.viajeVehiculoRepository.findByViajeId(viajeId);
    const principal = vehiculos.find((v) => v.rol === 'principal') || vehiculos[0];

    if (!principal) return null;

    const allDocs = await this.vehiculoChecklistDocumentRepository.findAllByVehiculoId(principal.vehiculoId, { viajeId, tipo });
    const allChecklistItems = await this.checklistItemRepository.findAll();

    const itemsResult: ViajeChecklistItemDetalleDto[] = allChecklistItems.map((catalogItem) => {
      const matchingDocs = allDocs.filter((d) => d.checklistItemId === catalogItem.id);
      const doc = matchingDocs.find((d) => d.activo) || matchingDocs[0];
      const isUpdate = doc && doc.viajeId === viajeId && doc.viajeTipo === tipo;

      return {
        checklistItemId: catalogItem.id,
        vehiculoChecklistDocumentId: doc ? doc.id : null,
        nombre: catalogItem.nombre,
        descripcion: catalogItem.descripcion,
        orden: catalogItem.orden,
        observacion: null,
        creadoEn: null,
        actualizadoEn: null,
        isUpdate: !!isUpdate,
      };
    });

    return {
      id: null,
      viajeId,
      tipo,
      items: itemsResult,
      creadoEn: null,
      actualizadoEn: null,
      validadoPor: null,
      validadoEn: null,
      observaciones: null,
    };
  }

  // ========== PASAJEROS ==========
  async findPasajeros(viajeId: number) {
    return await this.viajePasajeroRepository.findByViajeId(viajeId);
  }

  async upsertPasajeros(viajeId: number, data: ViajePasajeroFillDto) {
    // Deduplicate input by pasajeroId (last one wins)
    const uniqueMap = new Map<number, boolean>();
    (data.pasajeros || []).forEach((p) => uniqueMap.set(p.pasajeroId, p.asistencia));

    const dtos = Array.from(uniqueMap.entries()).map(([pasajeroId, asistencia]) => ({
      viajeId,
      pasajeroId,
      asistencia,
    }));

    // Sync logic: delete passengers NOT in the incoming list
    const current = await this.viajePasajeroRepository.findByViajeId(viajeId);
    const splitCurrentIds = new Set(current.map((c) => c.pasajeroId));
    const incomingIds = new Set(dtos.map((d) => d.pasajeroId));

    // IDs to delete: those in the DB but not in our incoming list
    const toDelete = Array.from(splitCurrentIds).filter((id) => !incomingIds.has(id));

    if (toDelete.length > 0) {
      await this.viajePasajeroRepository.removePasajeros(viajeId, toDelete);
    }

    // Upsert the remaining/new ones
    if (dtos.length > 0) {
      await this.viajePasajeroRepository.addPasajeros(dtos);
    }

    return await this.viajePasajeroRepository.findByViajeId(viajeId);
  }
}
