import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { VehiculoChecklistDocumentViajeTipo } from '@db/tables/vehiculo-checklist-document.table';
import { ViajeRepository } from '@repository/viaje.repository';
import { ViajeCircuitoRepository } from '@repository/viaje-circuito.repository';
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
import { ViajeCreateDto, ViajeDetalleCreateDto } from './dto/viaje/viaje-create.dto';
import { ViajeUpdateDto } from './dto/viaje/viaje-update.dto';
import { PaginatedViajeResultDto } from './dto/viaje/viaje-paginated.dto';
import { ViajeConductorDTO } from '@db/tables/viaje-conductor.table';
import { ViajeVehiculoDTO } from '@db/tables/viaje-vehiculo.table';
import { ViajeComentarioDTO } from '@db/tables/viaje-comentario.table';
import { ViajeServicioUpdateDto } from './dto/viaje-servicio/viaje-servicio-update.dto';
import { ViajeRegistrarParadaDto } from './dto/viaje-servicio/viaje-registrar-parada.dto';
import { ViajeRegistrarDescansoDto } from './dto/viaje-servicio/viaje-registrar-descanso.dto';
import { ViajeRegistrarSalidaDto } from './dto/viaje-servicio/viaje-registrar-salida.dto';
import { ViajeRegistrarLlegadaDto } from './dto/viaje-servicio/viaje-registrar-llegada.dto';
import { ViajeRegistrarPuntoDto } from './dto/viaje-servicio/viaje-registrar-punto.dto';
import { ViajeRegistrarBaseDto } from './dto/viaje-servicio/viaje-registrar-base.dto';
import { ViajeServicioTipo } from '@db/tables/viaje-servicio.table';
import { ViajeProximoTramoResultDto } from './dto/viaje-servicio/viaje-proximo-tramo-result.dto';
import { ViajeChecklistCreateDto } from './dto/viaje-checklist/viaje-checklist-create.dto';
import { ViajeChecklistUpdateDto } from './dto/viaje-checklist/viaje-checklist-update.dto';
import { ChecklistItemCreateDto } from './dto/checklist-item/checklist-item-create.dto';
import { ChecklistItemUpdateDto } from './dto/checklist-item/checklist-item-update.dto';
import { ViajeChecklistResultDto, ViajeChecklistItemDetalleDto } from './dto/viaje-checklist/viaje-checklist-result.dto';
import { ViajePasajeroRepository } from '@repository/viaje-pasajero.repository';
import { ViajePasajeroFillDto } from './dto/viaje-pasajero/viaje-pasajero-fill.dto';
import { ViajeTrayectoResultDto, ViajePuntoTrayectoDto } from './dto/viaje/viaje-trayecto-result.dto';
import { ViajeHojaRutaResultDto } from './dto/viaje-servicio/viaje-hoja-ruta-result.dto';
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
    private readonly viajeCircuitoRepository: ViajeCircuitoRepository,
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

    const { data: circuitos, total } = await this.viajeCircuitoRepository.findAllPaginated(page, limit, {
      search,
      fechaInicio,
      fechaFin,
    });

    const idsSet = new Set<number>();
    circuitos.forEach((c) => {
      if (c.viajeIdaId) idsSet.add(c.viajeIdaId);
      if (c.viajeVueltaId) idsSet.add(c.viajeVueltaId);
    });

    const allViajeIds = Array.from(idsSet);
    const viajesMap = new Map();

    if (allViajeIds.length > 0) {
      const viajesArray = await this.viajeRepository.findManyListByIds(allViajeIds);
      viajesArray.forEach((v) => viajesMap.set(v.id, v));
    }

    const data = circuitos.map((circuito) => {
      const ida = circuito.viajeIdaId ? viajesMap.get(circuito.viajeIdaId) || null : null;
      const vuelta = circuito.viajeVueltaId ? viajesMap.get(circuito.viajeVueltaId) || null : null;
      const { viajeIdaId, viajeVueltaId, ...circuitoRest } = circuito;
      return { ...circuitoRest, ida, vuelta };
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

  async findAllLightPaginated(
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
  ) {
    // Si el token es de un conductor, filtrar automáticamente solo sus viajes
    const conductoresFiltro = usuario?.tipo === 'conductor' ? [usuario.sub] : conductoresId;

    const { data: circuitos, total } = await this.viajeCircuitoRepository.findAllPaginated(page, limit, {
      search,
      fechaInicio,
      fechaFin,
    });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const idsSet = new Set<number>();
    circuitos.forEach((c) => {
      if (c.viajeIdaId) idsSet.add(c.viajeIdaId);
      if (c.viajeVueltaId) idsSet.add(c.viajeVueltaId);
    });

    const allViajeIds = Array.from(idsSet);
    const viajesMap = new Map();

    if (allViajeIds.length > 0) {
      const viajesArray = await this.viajeRepository.findManyLightByIds(allViajeIds);
      viajesArray.forEach((v) => viajesMap.set(v.id, v));
    }

    const data = circuitos.map((c) => {
      const ida = c.viajeIdaId ? viajesMap.get(c.viajeIdaId) || null : null;
      const vuelta = c.viajeVueltaId ? viajesMap.get(c.viajeVueltaId) || null : null;

      const { viajeIdaId, viajeVueltaId, ...cRest } = c;
      return { ...cRest, ida, vuelta };
    });

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

  async findTrayecto(id: number): Promise<ViajeTrayectoResultDto> {
    const viajeInfo = await this.viajeRepository.findOne(id);
    if (!viajeInfo) {
      throw new NotFoundException(`Viaje con ID ${id} no encontrado`);
    }

    const puntosTrayecto: ViajePuntoTrayectoDto[] = [];
    let currentOrden = 0;

    // Obtener servicios ya registrados (sin descansos)
    const servicios = await this.viajeServicioRepository.findByViajeIdWithParadas(id);
    const serviciosReales = servicios.filter((s) => s.tipo !== 'descanso');

    // Construir lista de puntos base (Ruta fija)
    const basePointsRaw: { tipo: ViajeServicioTipo; nombre: string; lat: number; lng: number; rutaParadaId: number | null }[] = [];
    if (viajeInfo.ruta) {
      const r = viajeInfo.ruta;
      const rutaParadasDB = await this.rutaParadaRepository.findAllByRutaId(r.id);
      rutaParadasDB.sort((a, b) => a.orden - b.orden);

      if (rutaParadasDB.length > 0) {
        // Si hay paradas, asumimos que la primera es origen y la última es destino segun indicación del usuario
        for (let i = 0; i < rutaParadasDB.length; i++) {
          const p = rutaParadasDB[i];
          let tipo: ViajeServicioTipo = 'punto';
          if (i === 0) tipo = 'origen';
          else if (i === rutaParadasDB.length - 1) tipo = 'destino';

          basePointsRaw.push({
            tipo,
            nombre: p.nombre,
            lat: Number(p.ubicacionLat),
            lng: Number(p.ubicacionLng),
            rutaParadaId: p.id,
          });
        }
      } else {
        // Si no hay paradas intermedias, usamos los campos de la ruta
        basePointsRaw.push({
          tipo: 'origen',
          nombre: r.origen,
          lat: Number(r.origenLat),
          lng: Number(r.origenLng),
          rutaParadaId: null,
        });
        basePointsRaw.push({
          tipo: 'destino',
          nombre: r.destino,
          lat: Number(r.destinoLat),
          lng: Number(r.destinoLng),
          rutaParadaId: null,
        });
      }
    }

    // Identificar qué puntos base ya se completaron
    const basePointsCompletadosIds = new Set<string>();

    for (const s of serviciosReales) {
      // Intentamos identificar a qué punto base corresponde este servicio
      // Prioridad: rutaParadaId, luego tipo (origen/destino)
      let key = s.rutaParadaId ? `id:${s.rutaParadaId}` : `tipo:${s.tipo}`;

      // Caso especial: si el servicio registrado es 'origen' pero en basePointsRaw tiene un rutaParadaId
      if (s.tipo === 'origen' && !s.rutaParadaId) {
        const firstBase = basePointsRaw.find((bp) => bp.tipo === 'origen');
        if (firstBase?.rutaParadaId) key = `id:${firstBase.rutaParadaId}`;
      }
      if (s.tipo === 'destino' && !s.rutaParadaId) {
        const lastBase = basePointsRaw.find((bp) => bp.tipo === 'destino');
        if (lastBase?.rutaParadaId) key = `id:${lastBase.rutaParadaId}`;
      }

      basePointsCompletadosIds.add(key);

      let nombrePunto = s.nombreLugar || '—';
      if (s.tipo === 'origen' && viajeInfo.ruta) nombrePunto = viajeInfo.ruta.origen;
      if (s.tipo === 'destino' && viajeInfo.ruta) nombrePunto = viajeInfo.ruta.destino;

      puntosTrayecto.push({
        nombre: nombrePunto,
        latitud: s.latitud ? Number(s.latitud) : null,
        longitud: s.longitud ? Number(s.longitud) : null,
        tipo: s.tipo as ViajeServicioTipo,
        orden: currentOrden++,
        completado: true,
        rutaParadaId: s.rutaParadaId || null,
      });
    }

    // Agregar puntos base que faltan
    for (const bp of basePointsRaw) {
      const key = bp.rutaParadaId ? `id:${bp.rutaParadaId}` : `tipo:${bp.tipo}`;
      if (!basePointsCompletadosIds.has(key)) {
        puntosTrayecto.push({
          nombre: bp.nombre,
          latitud: bp.lat,
          longitud: bp.lng,
          tipo: bp.tipo,
          orden: currentOrden++,
          completado: false,
          rutaParadaId: bp.rutaParadaId,
        });
      }
    }

    return { puntos: puntosTrayecto };
  }

  async createDetalle(data: ViajeDetalleCreateDto) {
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

  async createCircuito(data: ViajeCreateDto) {
    let viajeIdaId = null;
    let viajeVueltaId = null;

    if (data.ida) {
      const ida = await this.createDetalle(data.ida);
      viajeIdaId = ida.id;
    }

    if (data.vuelta) {
      const vuelta = await this.createDetalle(data.vuelta);
      viajeVueltaId = vuelta.id;
    }

    return await this.viajeCircuitoRepository.create({ viajeIdaId, viajeVueltaId });
  }

  async update(id: number, data: ViajeUpdateDto) {
    return this.viajeRepository.update(id, data);
  }

  async delete(id: number) {
    const result = await this.viajeRepository.delete(id);
    await this.viajeCircuitoRepository.nullifyTripReference(id);
    return result;
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

  async getHojaRuta(viajeId: number): Promise<ViajeHojaRutaResultDto> {
    let servicios = await this.viajeServicioRepository.findByViajeIdWithParadas(viajeId);
    // Omitir descansos segun solicitud del usuario
    servicios = servicios.filter((s) => s.tipo !== 'descanso');

    if (servicios.length < 2) {
      return { tramos: [], tiempoTotal: '—', kilometrajeTotal: '—' };
    }

    const formatHora = (date: Date | string | null): string => {
      if (!date) return '—';
      const d = typeof date === 'string' ? new Date(date) : date;
      let hours = d.getUTCHours();
      const minutes = String(d.getUTCMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    };

    const formatKm = (km: number | null): string => {
      if (km == null) return '—';
      return `${km.toLocaleString('es-PE')} KM`;
    };

    const formatDuracion = (minutos: number): string => {
      if (minutos < 1) return '< 1 min';
      if (minutos < 60) return `${minutos} min`;
      const h = Math.floor(minutos / 60);
      const m = minutos % 60;
      return m > 0 ? `${h}h ${m}min` : `${h}h`;
    };

    const tramos = [];
    let tiempoTotalMin = 0;
    let kmTotalRecorrido = 0;

    let currentKm = 0;
    // Encontrar el primer km disponible
    for (const s of servicios) {
      if (s.kilometrajeFinal != null) {
        currentKm = s.kilometrajeFinal;
        break;
      }
    }

    for (let i = 0; i < servicios.length - 1; i++) {
      const inicio = servicios[i];
      const fin = servicios[i + 1];

      if (inicio.kilometrajeFinal != null) {
        currentKm = inicio.kilometrajeFinal;
      }

      const kmIni = currentKm;
      const kmFinVal = fin.kilometrajeFinal != null ? fin.kilometrajeFinal : currentKm;
      const kmDiff = Math.max(kmFinVal - kmIni, 0);

      const horaIni = inicio.horaFinal ? new Date(inicio.horaFinal).getTime() : 0;
      const horaFin = fin.horaFinal ? new Date(fin.horaFinal).getTime() : 0;
      const diffMin = horaIni && horaFin ? Math.round((horaFin - horaIni) / 60000) : 0;

      tiempoTotalMin += diffMin;
      kmTotalRecorrido += kmDiff;

      tramos.push({
        horaSalida: formatHora(inicio.horaFinal),
        kmInicial: inicio.tipo === 'descanso' ? '—' : formatKm(inicio.kilometrajeFinal),
        puntoPartida: inicio.nombreLugar || '—',
        puntoLlegada: fin.nombreLugar || '—',
        numeroPasajeros: fin.tipo === 'descanso' ? null : (fin.numeroPasajeros ?? 0),
        horaTermino: formatHora(fin.horaFinal),
        kmFinal: fin.tipo === 'descanso' ? '—' : formatKm(fin.kilometrajeFinal),
        tiempoServicio: diffMin > 0 ? formatDuracion(diffMin) : '—',
        kilometrajeServicio: kmDiff > 0 ? formatKm(kmDiff) : '—',
        tipoDestino: fin.tipo,
      });

      if (fin.kilometrajeFinal != null) {
        currentKm = fin.kilometrajeFinal;
      }
    }

    return {
      tramos,
      tiempoTotal: tiempoTotalMin > 0 ? formatDuracion(tiempoTotalMin) : '—',
      kilometrajeTotal: kmTotalRecorrido > 0 ? formatKm(kmTotalRecorrido) : '—',
    };
  }

  async findServicio(servicioId: number) {
    const servicio = await this.viajeServicioRepository.findOne(servicioId);
    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${servicioId} no encontrado`);
    }
    return servicio;
  }

  private async registrarTramo(viajeId: number, tipo: ViajeServicioTipo, data: ViajeRegistrarBaseDto, rutaParadaId: number | null = null) {
    const viaje = await this.viajeRepository.findOne(viajeId);
    if (!viaje) throw new NotFoundException('Viaje no encontrado');

    const result = await this.viajeServicioRepository.create({
      viajeId,
      tipo,
      longitud: data.longitud,
      latitud: data.latitud,
      nombreLugar: data.nombreLugar || null,
      horaFinal: data.horaActual,
      kilometrajeFinal: data.kilometrajeActual,
      numeroPasajeros: data.cantidadPasajeros || 0,
      rutaParadaId,
    });

    // Actualizar kilometraje del vehículo si es el principal
    if (result.kilometrajeFinal) {
      const vehiculosAsignados = await this.viajeVehiculoRepository.findByViajeId(viajeId);
      const principal = vehiculosAsignados.find((v) => v.esPrincipal) || vehiculosAsignados[0];
      if (principal) {
        await this.vehiculoRepository.update(principal.vehiculoId, {
          kilometraje: result.kilometrajeFinal,
        });
      }
    }

    return result;
  }

  async registrarSalida(viajeId: number, data: ViajeRegistrarSalidaDto) {
    return this.registrarTramo(viajeId, 'origen', data, data.rutaParadaId || null);
  }

  async registrarLlegada(viajeId: number, data: ViajeRegistrarLlegadaDto) {
    return this.registrarTramo(viajeId, 'destino', data, data.rutaParadaId || null);
  }

  async registrarPunto(viajeId: number, data: ViajeRegistrarPuntoDto) {
    return this.registrarTramo(viajeId, 'punto', data, data.rutaParadaId);
  }

  async registrarParada(viajeId: number, data: ViajeRegistrarParadaDto) {
    return this.registrarTramo(viajeId, 'parada', data);
  }

  async registrarDescanso(viajeId: number, data: ViajeRegistrarDescansoDto) {
    const viaje = await this.viajeRepository.findOne(viajeId);
    if (!viaje) throw new NotFoundException('Viaje no encontrado');

    return await this.viajeServicioRepository.create({
      viajeId,
      tipo: 'descanso',
      longitud: data.longitud ?? null,
      latitud: data.latitud ?? null,
      nombreLugar: data.nombreLugar || null,
      horaFinal: data.horaActual,
      kilometrajeFinal: data.kilometrajeActual ?? null,
      numeroPasajeros: data.cantidadPasajeros ?? null,
      rutaParadaId: null,
    });
  }

  async updateServicio(servicioId: number, data: ViajeServicioUpdateDto) {
    const result = await this.viajeServicioRepository.update(servicioId, data);

    // Si se actualizó el kilometrajeFinal, también actualizar el vehículo
    if (result.kilometrajeFinal) {
      const vehiculosAsignados = await this.viajeVehiculoRepository.findByViajeId(result.viajeId);
      const principal = vehiculosAsignados.find((v) => v.esPrincipal) || vehiculosAsignados[0];
      if (principal) {
        await this.vehiculoRepository.update(principal.vehiculoId, {
          kilometraje: result.kilometrajeFinal,
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

  async verifyChecklist(viajeId: number, tipo: VehiculoChecklistDocumentViajeTipo, validadoPor: number | null) {
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

  async getProximoTramo(viajeId: number, tipo?: ViajeServicioTipo): Promise<ViajeProximoTramoResultDto> {
    const viajeInfo = await this.viajeRepository.findOne(viajeId);
    if (!viajeInfo) throw new NotFoundException('Viaje no encontrado');

    const servicios = await this.viajeServicioRepository.findByViajeId(viajeId);
    const lastServicio = servicios.length > 0 ? servicios[servicios.length - 1] : null;

    // Valores por defecto basados en el viaje o el último servicio
    let ultimoKilometraje = lastServicio?.kilometrajeFinal || 0;
    let ultimaHora = lastServicio?.horaFinal || viajeInfo.fechaSalida;

    // Si es el primer tramo (no hay servicios), buscamos el kilometraje actual del vehículo
    if (servicios.length === 0) {
      const vehiculos = await this.viajeVehiculoRepository.findByViajeId(viajeId);
      const principal = vehiculos.find((v) => v.esPrincipal) || vehiculos[0];
      if (principal) {
        const vehiculo = await this.vehiculoRepository.findOne(principal.vehiculoId);
        if (vehiculo) {
          ultimoKilometraje = vehiculo.kilometraje;
        }
      }
    }

    const result: ViajeProximoTramoResultDto = {
      tipo: 'parada',
      nombreLugar: null,
      latitud: lastServicio?.latitud != null ? lastServicio.latitud.toString() : null,
      longitud: lastServicio?.longitud != null ? lastServicio.longitud.toString() : null,
      ultimoKilometraje,
      ultimaHora: (ultimaHora as Date) || new Date(),
      ultimosPasajeros: lastServicio?.numeroPasajeros || 0,
      esPuntoFijo: false,
      rutaParadaId: null,
      faltanPuntosFijos: false,
    };

    // Si se solicita un tipo específico (origen/destino), retornar directamente
    if (tipo && viajeInfo.ruta) {
      if (tipo === 'origen') {
        result.tipo = 'origen';
        result.nombreLugar = viajeInfo.ruta.origen;
        result.latitud = viajeInfo.ruta.origenLat;
        result.longitud = viajeInfo.ruta.origenLng;
        result.esPuntoFijo = true;
        return result;
      }
      if (tipo === 'destino') {
        result.tipo = 'destino';
        result.nombreLugar = viajeInfo.ruta.destino;
        result.latitud = viajeInfo.ruta.destinoLat;
        result.longitud = viajeInfo.ruta.destinoLng;
        result.esPuntoFijo = true;
        return result;
      }
    }

    // Si tiene una ruta, analizar el progreso
    if (viajeInfo.ruta) {
      const paradasRuta = await this.rutaParadaRepository.findAllByRutaId(viajeInfo.ruta.id);
      const hasSalida = servicios.some((s) => s.tipo === 'origen');
      const hasLlegada = servicios.some((s) => s.tipo === 'destino');

      // Según el usuario, index 0 es origen y el último es destino en paradasRuta
      const puntosControlRuta = paradasRuta.length > 2 ? paradasRuta.slice(1, -1) : [];

      const IDsRegistrados = new Set(servicios.filter((s) => s.rutaParadaId).map((s) => s.rutaParadaId));
      const nombresRegistrados = new Set(servicios.filter((s) => s.nombreLugar).map((s) => s.nombreLugar.trim().toLowerCase()));

      const puntosControlFaltantes = puntosControlRuta.filter(
        (p) => !IDsRegistrados.has(p.id) && !nombresRegistrados.has(p.nombre.trim().toLowerCase()),
      );

      // "faltanPuntosFijos" se refiere específicamente a los puntos de control (intermedios)
      result.faltanPuntosFijos = puntosControlFaltantes.length > 0;

      // 1. Si no hay salida registrada, sugerir siempre el origen (aunque haya puntos marcados por error)
      if (!hasSalida) {
        result.tipo = 'origen';
        result.nombreLugar = viajeInfo.ruta.origen;
        result.latitud = viajeInfo.ruta.origenLat;
        result.longitud = viajeInfo.ruta.origenLng;
        result.esPuntoFijo = true;
        result.rutaParadaId = paradasRuta.length > 0 ? paradasRuta[0].id : null;
        return result;
      }

      // 2. Si faltan puntos de control, sugerir el primero faltante (incluso si hay llegada marcando error)
      if (puntosControlFaltantes.length > 0) {
        const proxima = puntosControlFaltantes[0];
        result.tipo = 'punto';
        result.nombreLugar = proxima.nombre;
        result.latitud = proxima.ubicacionLat?.toString();
        result.longitud = proxima.ubicacionLng?.toString();
        result.esPuntoFijo = true;
        result.rutaParadaId = proxima.id;
        return result;
      }

      // 3. Si todo lo anterior está listo, sugerir llegada si falta
      if (!hasLlegada) {
        result.tipo = 'destino';
        result.nombreLugar = viajeInfo.ruta.destino;
        result.latitud = viajeInfo.ruta.destinoLat;
        result.longitud = viajeInfo.ruta.destinoLng;
        result.esPuntoFijo = true;
        result.rutaParadaId = paradasRuta.length > 1 ? paradasRuta[paradasRuta.length - 1].id : null;
        result.faltanPuntosFijos = false;
        return result;
      }

      // 4. Si hay salida, puntos de control y llegada -> COMPLETADO
      // Retornar con datos del último servicio pero sin sugerencia de lugar
      result.tipo = 'parada';
      result.nombreLugar = null;
      result.latitud = null;
      result.longitud = null;
      result.esPuntoFijo = false;
      result.faltanPuntosFijos = false;
      return result;
    }

    // Si no hay ruta, solo sugerir hasta que se marque la llegada
    if (servicios.some((s) => s.tipo === 'destino')) {
      result.tipo = 'parada';
      result.nombreLugar = null;
      result.latitud = null;
      result.longitud = null;
      result.esPuntoFijo = false;
      result.faltanPuntosFijos = false;
      return result;
    }

    return result;
  }
}
