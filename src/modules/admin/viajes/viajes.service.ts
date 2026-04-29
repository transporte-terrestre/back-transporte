import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { VehiculoChecklistDocumentViajeTipo } from '@db/tables/vehiculo-checklist-document.table';
import { ViajeRepository } from '@repository/viaje.repository';
import { ViajeCircuitoRepository } from '@repository/viaje-circuito.repository';
import { ViajeConductorRepository } from '@repository/viaje-conductor.repository';
import { ViajeVehiculoRepository } from '@repository/viaje-vehiculo.repository';
import { ViajeComentarioRepository } from '@repository/viaje-comentario.repository';
import { ViajeTramoRepository } from '@repository/viaje-tramo.repository';
import { ChecklistItemRepository } from '@repository/checklist-item.repository';
import { ViajeChecklistRepository } from '@repository/viaje-checklist.repository';
import { RutaParadaRepository } from '@repository/ruta-parada.repository';
import { VehiculoRepository } from '@repository/vehiculo.repository';
import { ClienteRepository } from '@repository/cliente.repository';
import { MantenimientoRepository } from '@repository/mantenimiento.repository';
import { VehiculoChecklistDocumentRepository } from '@repository/vehiculo-checklist-document.repository'; // Inyectado
import { ViajeCreateDto, ViajeDetalleCreateDto } from './dto/viaje/viaje-create.dto';
import { ViajeUpdateDto } from './dto/viaje/viaje-update.dto';
import { PaginatedViajeResultDto } from './dto/viaje/viaje-paginated.dto';
import { ViajeConductorDTO } from '@db/tables/viaje-conductor.table';
import { ViajeVehiculoDTO } from '@db/tables/viaje-vehiculo.table';
import { ViajeComentarioDTO } from '@db/tables/viaje-comentario.table';
import { ViajeTramoUpdateDto } from './dto/viaje-tramo/viaje-tramo-update.dto';
import { ViajeRegistrarParadaDto } from './dto/viaje-tramo/viaje-registrar-parada.dto';
import { ViajeRegistrarDescansoDto } from './dto/viaje-tramo/viaje-registrar-descanso.dto';
import { ViajeRegistrarSalidaDto } from './dto/viaje-tramo/viaje-registrar-salida.dto';
import { ViajeRegistrarLlegadaDto } from './dto/viaje-tramo/viaje-registrar-llegada.dto';
import { ViajeRegistrarPuntoDto } from './dto/viaje-tramo/viaje-registrar-punto.dto';
import { ViajeRegistrarBaseDto } from './dto/viaje-tramo/viaje-registrar-base.dto';
import { ViajeTramoTipo } from '@db/tables/viaje-tramo.table';
import { ViajeProximoTramoResultDto } from './dto/viaje-tramo/viaje-proximo-tramo-result.dto';
import { ViajeChecklistCreateDto } from './dto/viaje-checklist/viaje-checklist-create.dto';
import { ViajeChecklistUpdateDto } from './dto/viaje-checklist/viaje-checklist-update.dto';
import { ChecklistItemCreateDto } from './dto/checklist-item/checklist-item-create.dto';
import { ChecklistItemUpdateDto } from './dto/checklist-item/checklist-item-update.dto';
import { ViajeChecklistResultDto, ViajeChecklistItemDetalleDto } from './dto/viaje-checklist/viaje-checklist-result.dto';
import { ViajePasajeroRepository } from '@repository/viaje-pasajero.repository';
import { ViajePasajeroFillDto } from './dto/viaje-pasajero/viaje-pasajero-fill.dto';
import { ViajePasajeroResultDto } from './dto/viaje-pasajero/viaje-pasajero-result.dto';
import { ViajeTrayectoResultDto, ViajePuntoTrayectoDto } from './dto/viaje/viaje-trayecto-result.dto';
import { ViajeHojaRutaResultDto } from './dto/viaje-tramo/viaje-hoja-ruta-result.dto';

import { GeminiAiService } from '@module/gemini-ai/gemini-ai.service';
import { PasajeroRepository } from '@repository/pasajero.repository';
import { ViajeEscanearDnisDto } from './dto/viaje-pasajero/viaje-escanear-dnis.dto';
import { ScanDniResultItem, ViajeEscanearDnisResultDto } from './dto/viaje-pasajero/viaje-escanear-dnis-result.dto';
import { ViajePasajeroMovimientoRepository } from '@repository/viaje-pasajero-movimiento.repository';
import { AlquilerRepository } from '@repository/alquiler.repository';
import { VehiculoDocumentoRepository } from '@repository/vehiculo-documento.repository';
import { ConductorDocumentoRepository } from '@repository/conductor-documento.repository';
import { ConductorRepository } from '@repository/conductor.repository';
import { ValidarVehiculoQueryDto } from './dto/viaje/validar-vehiculo-query.dto';
import { ValidarConductorQueryDto } from './dto/viaje/validar-conductor-query.dto';
import { ValidacionResultDto } from './dto/viaje/validacion-result.dto';
import { ViajeRepostajeMovimientoRepository } from '@repository/viaje-repostaje-movimiento.repository';
import { ViajeRepostajeMovimientoCreateDto } from './dto/viaje-repostaje-movimiento/viaje-repostaje-movimiento-create.dto';

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
    private readonly viajeTramoRepository: ViajeTramoRepository,
    private readonly checklistItemRepository: ChecklistItemRepository,
    private readonly viajeChecklistRepository: ViajeChecklistRepository,
    private readonly viajePasajeroRepository: ViajePasajeroRepository,
    private readonly vehiculoChecklistDocumentRepository: VehiculoChecklistDocumentRepository, // Inyectado
    private readonly rutaParadaRepository: RutaParadaRepository,
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly clienteRepository: ClienteRepository,
    private readonly viajeCircuitoRepository: ViajeCircuitoRepository,

    private readonly mantenimientoRepository: MantenimientoRepository,
    private readonly geminiAiService: GeminiAiService,
    private readonly pasajeroRepository: PasajeroRepository,
    private readonly viajePasajeroMovimientoRepository: ViajePasajeroMovimientoRepository,
    private readonly alquilerRepository: AlquilerRepository,
    private readonly vehiculoDocumentoRepository: VehiculoDocumentoRepository,
    private readonly conductorDocumentoRepository: ConductorDocumentoRepository,
    private readonly conductorRepository: ConductorRepository,
    private readonly viajeRepostajeMovimientoRepository: ViajeRepostajeMovimientoRepository,
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

    const filters = {
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
    };

    const { data: circuitos, total } = await this.viajeCircuitoRepository.findAllPaginated(page, limit, filters);

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
      let ida = circuito.viajeIdaId ? viajesMap.get(circuito.viajeIdaId) || null : null;
      let vuelta = circuito.viajeVueltaId ? viajesMap.get(circuito.viajeVueltaId) || null : null;
      let circuitoCompleto = null;

      // Si el viaje de ida es realmente un circuito, moverlo
      if (ida && ida.sentido === 'circuito') {
        circuitoCompleto = ida;
        ida = null;
      }

      // Por si acaso el de vuelta fuera circuito (no debería pasar por lógica de negocio pero para consistencia)
      if (vuelta && vuelta.sentido === 'circuito') {
        circuitoCompleto = vuelta;
        vuelta = null;
      }

      const { viajeIdaId, viajeVueltaId, ...circuitoRest } = circuito;
      return { ...circuitoRest, ida, vuelta, circuito: circuitoCompleto };
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

    const filters = {
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
    };

    const { data: circuitos, total } = await this.viajeCircuitoRepository.findAllPaginated(page, limit, filters);

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
      let ida = c.viajeIdaId ? viajesMap.get(c.viajeIdaId) || null : null;
      let vuelta = c.viajeVueltaId ? viajesMap.get(c.viajeVueltaId) || null : null;
      let circuitoCompleto = null;

      if (ida && ida.sentido === 'circuito') {
        circuitoCompleto = ida;
        ida = null;
      }

      if (vuelta && vuelta.sentido === 'circuito') {
        circuitoCompleto = vuelta;
        vuelta = null;
      }

      const { viajeIdaId, viajeVueltaId, ...cRest } = c;
      return { ...cRest, ida, vuelta, circuito: circuitoCompleto };
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

    // Obtener tramos ya registrados (sin descansos)
    const tramos = await this.viajeTramoRepository.findByViajeIdWithParadas(id);
    const tramosReales = tramos.filter((s) => s.tipo !== 'descanso');

    // Construir lista de puntos base (Ruta fija)
    const basePointsRaw: { tipo: ViajeTramoTipo; nombre: string; lat: number; lng: number; rutaParadaId: number | null }[] = [];
    if (viajeInfo.ruta) {
      const r = viajeInfo.ruta;
      const rutaParadasDB = await this.rutaParadaRepository.findAllByRutaId(r.id);
      rutaParadasDB.sort((a, b) => a.orden - b.orden);

      if (rutaParadasDB.length > 0) {
        // Si hay paradas, asumimos que la primera es origen y la última es destino segun indicación del usuario
        for (let i = 0; i < rutaParadasDB.length; i++) {
          const p = rutaParadasDB[i];
          let tipo: ViajeTramoTipo = 'punto';
          if (i === 0) tipo = 'origen';
          else if (i === rutaParadasDB.length - 1 && r.destinoLat != null) tipo = 'destino';

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
        if (r.destinoLat != null) {
          basePointsRaw.push({
            tipo: 'destino',
            nombre: r.destino,
            lat: Number(r.destinoLat),
            lng: Number(r.destinoLng),
            rutaParadaId: null,
          });
        }
      }
    }

    // Identificar qué puntos base ya se completaron
    const basePointsCompletadosIds = new Set<string>();

    for (const s of tramosReales) {
      // Intentamos identificar a qué punto base corresponde este tramo
      // Prioridad: rutaParadaId, luego tipo (origen/destino)
      let key = s.rutaParadaId ? `id:${s.rutaParadaId}` : `tipo:${s.tipo}`;

      // Caso especial: si el tramo registrado es 'origen' pero en basePointsRaw tiene un rutaParadaId
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
        tipo: s.tipo as ViajeTramoTipo,
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

  // ========== TRAMOS DEL VIAJE ==========
  async getRepostajesPorTramo(viajeTramoId: number) {
    return await this.viajeRepostajeMovimientoRepository.findByViajeTramo(viajeTramoId);
  }

  async registrarRepostaje(data: ViajeRepostajeMovimientoCreateDto) {
    const tramo = await this.viajeTramoRepository.findOne(data.viajeTramoId);
    if (!tramo) throw new NotFoundException('Tramo no encontrado');
    return await this.viajeRepostajeMovimientoRepository.create({
      viajeTramoId: data.viajeTramoId,
      combustible: data.combustible,
      galonesEstablecidos: data.galonesEstablecidos.toString(),
    });
  }

  async deleteRepostaje(id: number) {
    return await this.viajeRepostajeMovimientoRepository.delete(id);
  }

  async findTramos(viajeId: number) {
    return await this.viajeTramoRepository.findByViajeIdWithParadas(viajeId);
  }

  async getHojaRuta(viajeId: number): Promise<ViajeHojaRutaResultDto> {
    let tramos = await this.viajeTramoRepository.findByViajeIdWithParadas(viajeId);
    // Omitir descansos segun solicitud del usuario
    tramos = tramos.filter((s) => s.tipo !== 'descanso');

    if (tramos.length < 2) {
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

    const tramosResult = [];
    let tiempoTotalMin = 0;
    let kmTotalRecorrido = 0;

    let currentKm = 0;
    // Encontrar el primer km disponible
    for (const s of tramos) {
      if (s.kilometrajeFinal != null) {
        currentKm = s.kilometrajeFinal;
        break;
      }
    }

    for (let i = 0; i < tramos.length - 1; i++) {
      const inicio = tramos[i];
      const fin = tramos[i + 1];

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

      tramosResult.push({
        horaSalida: formatHora(inicio.horaFinal),
        kmInicial: inicio.tipo === 'descanso' ? '—' : formatKm(inicio.kilometrajeFinal),
        puntoPartida: inicio.nombreLugar || '—',
        puntoLlegada: fin.nombreLugar || '—',
        numeroPasajeros: inicio.tipo === 'descanso' ? null : (inicio.numeroPasajeros ?? 0),
        horaTermino: formatHora(fin.horaFinal),
        kmFinal: fin.tipo === 'descanso' ? '—' : formatKm(fin.kilometrajeFinal),
        tiempoRecorrido: diffMin > 0 ? formatDuracion(diffMin) : '—',
        kilometrajeRecorrido: kmDiff > 0 ? formatKm(kmDiff) : '—',
        tipoDestino: fin.tipo,
      });

      if (fin.kilometrajeFinal != null) {
        currentKm = fin.kilometrajeFinal;
      }
    }

    return {
      tramos: tramosResult,
      tiempoTotal: tiempoTotalMin > 0 ? formatDuracion(tiempoTotalMin) : '—',
      kilometrajeTotal: kmTotalRecorrido > 0 ? formatKm(kmTotalRecorrido) : '—',
    };
  }

  async findTramo(tramoId: number) {
    const tramo = await this.viajeTramoRepository.findOne(tramoId);
    if (!tramo) {
      throw new NotFoundException(`Tramo con ID ${tramoId} no encontrado`);
    }
    return tramo;
  }

  private async registrarTramo(viajeId: number, tipo: ViajeTramoTipo, data: ViajeRegistrarBaseDto, rutaParadaId: number | null = null) {
    const viaje = await this.viajeRepository.findOne(viajeId);
    if (!viaje) throw new NotFoundException('Viaje no encontrado');

    const result = await this.viajeTramoRepository.create({
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

    // Ejecutar lógica de estados y notificaciones en segundo plano (Fire and Forget)
    this.procesarSideEffectsRegistrarTramo(viajeId, tipo, data, result.kilometrajeFinal).catch((err) => {
      console.error('Error en procesarSideEffectsViaje:', err);
    });

    return result;
  }

  async registrarDescanso(viajeId: number, data: ViajeRegistrarDescansoDto) {
    const viaje = await this.viajeRepository.findOne(viajeId);
    if (!viaje) throw new NotFoundException('Viaje no encontrado');

    return await this.viajeTramoRepository.create({
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

  async updateTramo(tramoId: number, data: ViajeTramoUpdateDto) {
    const result = await this.viajeTramoRepository.update(tramoId, data);

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

    // SI se actualiza la hora final de origen o destino, sincronizarlo con el viaje para mantener consistencia
    if (data.horaFinal && result.tipo === 'origen') {
      await this.viajeRepository.update(result.viajeId, { fechaSalida: new Date(data.horaFinal) });
    } else if (data.horaFinal && result.tipo === 'destino') {
      await this.viajeRepository.update(result.viajeId, { fechaLlegada: new Date(data.horaFinal) });
    }

    // Recalcular distancia final por si actualizamos el origen o el destino
    this.recalcularDistanciaViaje(result.viajeId).catch(console.error);

    return result;
  }

  async deleteTramo(tramoId: number) {
    const tramo = await this.viajeTramoRepository.findOne(tramoId);
    if (!tramo) throw new NotFoundException('Tramo no encontrado');

    const result = await this.viajeTramoRepository.delete(tramoId);

    // Ajustar estados y kilometraje en segundo plano (Fire and Forget)
    this.procesarSideEffectsEliminarTramo(tramo.viajeId, tramo.tipo as ViajeTramoTipo, tramoId).catch((err) => {
      console.error('Error en procesarSideEffectsEliminarTramo:', err);
    });

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

  private async recalcularDistanciaViaje(viajeId: number) {
    const tramos = await this.viajeTramoRepository.findByViajeIdWithParadas(viajeId);

    const tramoInicial = tramos.find((s) => s.tipo === 'origen');
    const tramoFinal = [...tramos].reverse().find((s) => s.tipo === 'destino');

    if (tramoInicial && tramoFinal && tramoInicial.kilometrajeFinal != null && tramoFinal.kilometrajeFinal != null) {
      const kmInicial = Number(tramoInicial.kilometrajeFinal);
      const kmFinal = Number(tramoFinal.kilometrajeFinal);
      const kmRecorrido = Math.max(kmFinal - kmInicial, 0);

      await this.viajeRepository.update(viajeId, {
        distanciaFinal: kmRecorrido.toFixed(2),
      });
    }
  }

  private async procesarSideEffectsRegistrarTramo(
    viajeId: number,
    tipo: ViajeTramoTipo,
    data: ViajeRegistrarBaseDto,
    kilometrajeFinal: number | null,
  ) {
    try {
      const vehiculosAsignados = await this.viajeVehiculoRepository.findByViajeId(viajeId);
      const principal = vehiculosAsignados.find((v) => v.esPrincipal) || vehiculosAsignados[0];

      // 1. Actualizar kilometraje del vehículo si es proporcionado
      if (kilometrajeFinal && principal) {
        await this.vehiculoRepository.update(principal.vehiculoId, {
          kilometraje: kilometrajeFinal,
        });
      }

      // 2. Lógica según el tipo de tramo (Salida o Llegada)
      if (tipo === 'origen') {
        // Inicia el viaje
        await this.viajeRepository.update(viajeId, {
          estado: 'en_progreso',
          fechaSalida: new Date(data.horaActual),
        });
        // Vehículo pasa a circulación
        if (principal) {
          await this.vehiculoRepository.update(principal.vehiculoId, { estado: 'circulacion' });
        }
      } else if (tipo === 'destino') {
        let distanciaFinalCalculada: string | undefined = undefined;

        if (data.kilometrajeActual != null) {
          const tramos = await this.viajeTramoRepository.findByViajeIdWithParadas(viajeId);
          const tramoInicial = tramos.find((s) => s.tipo === 'origen');
          if (tramoInicial && tramoInicial.kilometrajeFinal != null) {
            const kmInicial = Number(tramoInicial.kilometrajeFinal);
            const kmFinal = Number(data.kilometrajeActual);
            const kmRecorrido = Math.max(kmFinal - kmInicial, 0);

            distanciaFinalCalculada = kmRecorrido.toFixed(2);
          }
        }

        // Finaliza el viaje
        await this.viajeRepository.update(viajeId, {
          estado: 'completado',
          fechaLlegada: data.horaActual,
          distanciaFinal: distanciaFinalCalculada,
        });

        // Vehículo vuelve a estar disponible
        if (principal) {
          await this.vehiculoRepository.update(principal.vehiculoId, { estado: 'disponible' });
        }
      }
    } catch (error) {
      // Registrar error pero permitir que el proceso de fondo termine sin afectar al hilo principal
      console.error(`Error procesando side effects para el viaje ${viajeId}:`, error);
    }
  }

  private async procesarSideEffectsEliminarTramo(viajeId: number, tipoEliminado: ViajeTramoTipo, tramoId: number) {
    try {
      const vehiculosAsignados = await this.viajeVehiculoRepository.findByViajeId(viajeId);
      const principal = vehiculosAsignados.find((v) => v.esPrincipal) || vehiculosAsignados[0];

      // 1. Lógica de reversión de estados según el tipo de tramo eliminado
      if (tipoEliminado === 'origen') {
        // Si se elimina el origen, el viaje vuelve a estar programado y se limpia la fecha real
        await this.viajeRepository.update(viajeId, {
          estado: 'programado',
          fechaSalida: null,
        });
        if (principal) {
          // El vehículo vuelve a estar disponible
          await this.vehiculoRepository.update(principal.vehiculoId, { estado: 'disponible' });
        }
      } else if (tipoEliminado === 'destino') {
        // Si se elimina el destino, el viaje vuelve a estar en progreso
        await this.viajeRepository.update(viajeId, {
          estado: 'en_progreso',
          fechaLlegada: null,
          distanciaFinal: null,
        });
        if (principal) {
          // El vehículo vuelve a estar en circulación
          await this.vehiculoRepository.update(principal.vehiculoId, { estado: 'circulacion' });
        }
      }

      // 2. Re-sincronizar el kilometraje del vehículo con el ÚLTIMO tramo que queda registrado
      if (principal) {
        const ultimoTramo = await this.viajeTramoRepository.findLastByViajeId(viajeId);
        if (ultimoTramo && ultimoTramo.kilometrajeFinal) {
          await this.vehiculoRepository.update(principal.vehiculoId, {
            kilometraje: ultimoTramo.kilometrajeFinal,
          });
        }
      }

      // 3. Eliminar asistencia de pasajeros marcada en este tramo
      const movimientos = await this.viajePasajeroMovimientoRepository.findByViajeTramo(tramoId);
      for (const mov of movimientos) {
        if (mov.tipoMovimiento === 'entrada') {
          // Borrar el movimiento del tramo
          await this.viajePasajeroMovimientoRepository.delete(mov.id);

          // Comprobar si tiene más entradas vinculadas a OTROS tramos del mismo viaje
          const otrosMovs = await this.viajePasajeroMovimientoRepository.findByViajePasajero(mov.viajePasajeroId);
          const aunTieneAsistencia = otrosMovs.some((m) => m.tipoMovimiento === 'entrada' && m.viajeTramoId !== tramoId && m.eliminadoEn === null);

          if (!aunTieneAsistencia) {
            await this.viajePasajeroRepository.updateAsistencia(mov.viajePasajeroId, false);
          }
        }
      }

      // Finalmente, resincronizar los contadores acumulados de todos los tramos del viaje
      await this.viajeTramoRepository.syncAllNumeroPasajeros(viajeId);
    } catch (error) {
      console.error(`Error procesando side effects para eliminación en viaje ${viajeId}:`, error);
    }
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
        isUpdate: !!existingItem,
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
  async findPasajeros(viajeId: number, viajeTramoId?: number) {
    const [listaPasajeros, todosMovimientos] = await Promise.all([
      this.viajePasajeroRepository.findByViajeId(viajeId),
      this.viajePasajeroMovimientoRepository.findByViajeId(viajeId),
    ]);

    // Obtener la hora del tramo consultado si existe para filtrar el historial
    let horaLimite: number | null = null;
    if (viajeTramoId) {
      const tramoConsultado = await this.viajeTramoRepository.findOne(viajeTramoId);
      if (tramoConsultado?.horaFinal) {
        horaLimite = new Date(tramoConsultado.horaFinal).getTime();
      }
    }

    return listaPasajeros.map((p) => {
      // Filtrar movimientos por pasajero y, opcionalmente, por tiempo
      let historial = todosMovimientos.filter((m) => m.viajePasajeroId === p.id);

      if (horaLimite !== null) {
        // Filtramos basándonos en la hora en que ocurrió el tramo del movimiento
        historial = historial.filter((m) => {
          if (!m.tramoHoraFinal) return m.viajeTramoId === viajeTramoId;
          const mHoraTramo = new Date(m.tramoHoraFinal).getTime();
          return mHoraTramo <= (horaLimite as number) || m.viajeTramoId === viajeTramoId;
        });
      }

      const entradas = historial.filter((m) => m.tipoMovimiento === 'entrada');
      const salidas = historial.filter((m) => m.tipoMovimiento === 'salida');

      const ultimaEntrada = entradas[entradas.length - 1];
      const ultimaSalida = salidas[salidas.length - 1];

      // El pasajero está "arriba" si su último movimiento (hasta este tramo) fue una entrada
      const estaArriba = !!ultimaEntrada && (!ultimaSalida || new Date(ultimaEntrada.hora).getTime() > new Date(ultimaSalida.hora).getTime());

      return {
        ...p,
        asistencia: viajeTramoId ? entradas.length > 0 : p.asistencia,
        estaArriba,
        paradaAsistenciaId: ultimaEntrada?.viajeTramoId || null,
        paradaAsistenciaNombre: ultimaEntrada?.paradaNombre || null,
        horaAsistencia: ultimaEntrada?.hora ? new Date(ultimaEntrada.hora).toISOString() : null,
        esAsistenciaTramoActual: viajeTramoId ? ultimaEntrada?.viajeTramoId === viajeTramoId : null,

        paradaSalidaId: ultimaSalida?.viajeTramoId || null,
        paradaSalidaNombre: ultimaSalida?.paradaNombre || null,
        horaSalida: ultimaSalida?.hora ? new Date(ultimaSalida.hora).toISOString() : null,
        esSalidaTramoActual: viajeTramoId ? ultimaSalida?.viajeTramoId === viajeTramoId : null,

        historial: historial.map((m) => ({
          id: m.id,
          tipoMovimiento: m.tipoMovimiento,
          viajeTramoId: m.viajeTramoId,
          paradaNombre: m.paradaNombre,
          hora: new Date(m.hora).toISOString(),
        })),
      };
    });
  }

  async upsertPasajeros(viajeId: number, data: ViajePasajeroFillDto) {
    // 1. Obtener los pasajeros actuales del viaje
    const currentList = await this.viajePasajeroRepository.findByViajeId(viajeId);

    const incoming = data.pasajeros || [];

    // 2. Preparar los DTOs para insertar/actualizar
    const dtos = incoming.map((p) => ({
      viajeId,
      pasajeroId: p.pasajeroId || null,
      dni: p.dni || null,
      nombres: p.nombres || null,
      apellidos: p.apellidos || null,
      empresa: p.empresa || null,
      asistencia: p.asistencia,
    }));

    // 3. Identificar registros a eliminar
    const idsToKeep = new Set<number>();

    for (const item of incoming) {
      const match = currentList.find((c) => {
        if (item.pasajeroId && c.pasajeroId === item.pasajeroId) return true;
        if (!item.pasajeroId && item.dni && c.dni === item.dni) return true;
        return false;
      });
      if (match) idsToKeep.add(match.id);
    }

    const idsToDelete = currentList.filter((c) => !idsToKeep.has(c.id)).map((c) => c.id);

    // 4. Ejecutar cambios en la DB
    if (idsToDelete.length > 0) {
      await this.viajePasajeroRepository.removePasajeros(viajeId, idsToDelete);
    }

    if (dtos.length > 0) {
      await this.viajePasajeroRepository.addPasajeros(dtos);
    }

    // 5. Retornar la lista actualizada calculada
    return await this.findPasajeros(viajeId);
  }

  async abordarPasajeros(viajePasajeroIds: number[], tramoId: number): Promise<ViajePasajeroResultDto[]> {
    const tramo = await this.viajeTramoRepository.findOne(tramoId);
    if (!tramo) return [];

    const resultados = [];
    const setIdsNuevos = new Set(viajePasajeroIds);

    // 1. Sincronización: Quitar abordajes EN ESTE TRAMO que ya no están en la lista (corrección manual del conductor)
    const currentInTramo = await this.viajePasajeroMovimientoRepository.findByViajeTramo(tramoId);
    for (const mov of currentInTramo) {
      if (mov.tipoMovimiento === 'entrada' && !setIdsNuevos.has(mov.viajePasajeroId)) {
        await this.viajePasajeroMovimientoRepository.delete(mov.id);
        
        // Verificar si el pasajero tiene algun otro abordaje en el viaje para mantener asistencia
        const otherMovs = await this.viajePasajeroMovimientoRepository.findByViajePasajero(mov.viajePasajeroId);
        if (!otherMovs.some(m => m.tipoMovimiento === 'entrada')) {
          await this.viajePasajeroRepository.updateAsistencia(mov.viajePasajeroId, false);
        }
      }
    }

    // 2. Procesar abordajes
    for (const id of viajePasajeroIds) {
      try {
        const [updated] = await this.viajePasajeroRepository.updateAsistencia(id, true);
        if (!updated) continue;

        // Obtener historial ordenado por hora descendente para ver el estado más reciente
        const movements = await this.viajePasajeroMovimientoRepository.findByViajePasajero(id);
        movements.sort((a, b) => new Date(b.hora).getTime() - new Date(a.hora).getTime());
        
        const lastMov = movements[0];

        // CASO A: Ya abordó en este mismo tramo -> Mantener y retornar
        if (lastMov?.tipoMovimiento === 'entrada' && lastMov.viajeTramoId === tramoId) {
          resultados.push(updated);
          continue;
        }

        // CASO B: El pasajero está "abajo" (su último movimiento fue salida) o no tiene historial -> Crear NUEVA entrada
        if (!lastMov || lastMov.tipoMovimiento === 'salida') {
          const peruTimeStr = new Date().toLocaleString('en-US', { timeZone: 'America/Lima', hour12: false });
          const limaDate = new Date(peruTimeStr + " UTC");
          await this.viajePasajeroMovimientoRepository.create({ 
            viajePasajeroId: id, 
            viajeTramoId: tramoId, 
            tipoMovimiento: 'entrada', 
            hora: limaDate 
          });
        } 
        // CASO C: El pasajero ya estaba "arriba" en otro tramo sin haber bajado -> Corrección de punto de abordaje
        else if (lastMov.tipoMovimiento === 'entrada' && lastMov.viajeTramoId !== tramoId) {
          await this.viajePasajeroMovimientoRepository.delete(lastMov.id);
          const peruTimeStr = new Date().toLocaleString('en-US', { timeZone: 'America/Lima', hour12: false });
          const limaDate = new Date(peruTimeStr + " UTC");
          await this.viajePasajeroMovimientoRepository.create({ 
            viajePasajeroId: id, 
            viajeTramoId: tramoId, 
            tipoMovimiento: 'entrada', 
            hora: limaDate 
          });
        }

        resultados.push(updated);
      } catch (e) {
        console.error(`Error en abordarPasajeros ${id}:`, e);
      }
    }

    // 3. Sincronizar contadores de pasajeros acumulados para todos los tramos del viaje
    await this.viajeTramoRepository.syncAllNumeroPasajeros(tramo.viajeId);

    return await this.findPasajeros(tramo.viajeId, tramoId);
  }

  async desabordarPasajeros(viajePasajeroIds: number[], tramoId: number): Promise<ViajePasajeroResultDto[]> {
    const tramo = await this.viajeTramoRepository.findOne(tramoId);
    if (!tramo) return [];

    const resultados = [];
    const setIdsNuevos = new Set(viajePasajeroIds);

    // 1. Sincronización: Quitar salidas EN ESTE TRAMO que ya no están en la lista (corrección manual)
    const currentInTramo = await this.viajePasajeroMovimientoRepository.findByViajeTramo(tramoId);
    for (const mov of currentInTramo) {
      if (mov.tipoMovimiento === 'salida' && !setIdsNuevos.has(mov.viajePasajeroId)) {
        await this.viajePasajeroMovimientoRepository.delete(mov.id);
      }
    }

    // 2. Registrar salida para cada pasajero
    for (const id of viajePasajeroIds) {
      try {
        const movements = await this.viajePasajeroMovimientoRepository.findByViajePasajero(id);
        movements.sort((a, b) => new Date(b.hora).getTime() - new Date(a.hora).getTime());
        
        const lastMov = movements[0];

        // CASO A: Ya bajó en este mismo tramo -> Mantener y retornar
        if (lastMov?.tipoMovimiento === 'salida' && lastMov.viajeTramoId === tramoId) {
          const pasajero = await this.viajePasajeroRepository.findOne(id);
          if (pasajero) resultados.push(pasajero);
          continue;
        }

        // CASO B: El pasajero está "arriba" (su último movimiento fue entrada) -> Crear NUEVA salida
        if (lastMov?.tipoMovimiento === 'entrada') {
          const peruTimeStr = new Date().toLocaleString('en-US', { timeZone: 'America/Lima', hour12: false });
          const limaDate = new Date(peruTimeStr + " UTC");
          await this.viajePasajeroMovimientoRepository.create({ 
            viajePasajeroId: id, 
            viajeTramoId: tramoId, 
            tipoMovimiento: 'salida', 
            hora: limaDate 
          });
        }
        // CASO C: El pasajero ya estaba "abajo" en otro tramo -> Corrección de punto de descenso
        else if (lastMov?.tipoMovimiento === 'salida' && lastMov.viajeTramoId !== tramoId) {
          await this.viajePasajeroMovimientoRepository.delete(lastMov.id);
          const peruTimeStr = new Date().toLocaleString('en-US', { timeZone: 'America/Lima', hour12: false });
          const limaDate = new Date(peruTimeStr + " UTC");
          await this.viajePasajeroMovimientoRepository.create({ 
            viajePasajeroId: id, 
            viajeTramoId: tramoId, 
            tipoMovimiento: 'salida', 
            hora: limaDate 
          });
        }
        // Si no tiene historial (!lastMov), no hacemos nada ya que no puede bajar si nunca subió.

        const pasajero = await this.viajePasajeroRepository.findOne(id);
        if (pasajero) resultados.push(pasajero);
      } catch (e) {
        console.error(`Error en desabordarPasajeros ${id}:`, e);
      }
    }

    // Sincronizar contadores acumulados para todos los tramos del viaje
    await this.viajeTramoRepository.syncAllNumeroPasajeros(tramo.viajeId);

    return await this.findPasajeros(tramo.viajeId, tramoId);
  }

  async abordarPasajerosPorDni(viajeId: number, dnis: string[], tramoId: number): Promise<ViajePasajeroResultDto[]> {
    if (!Array.isArray(dnis) || dnis.length === 0) {
      throw new BadRequestException('Debe enviar al menos un DNI para abordar pasajeros.');
    }

    const dnisNormalizados = Array.from(new Set(dnis.map((dni) => String(dni ?? '').replace(/\D/g, '')).filter((dni) => dni.length > 0)));

    if (dnisNormalizados.length === 0) {
      throw new BadRequestException('Los DNIs enviados no tienen un formato valido.');
    }

    const pasajerosViaje = await this.viajePasajeroRepository.findByViajeId(viajeId);
    const idsPorDni = new Map<string, number>();

    for (const pasajero of pasajerosViaje) {
      const dni = String(pasajero.dni ?? '').replace(/\D/g, '');
      if (dni.length > 0 && !idsPorDni.has(dni)) {
        idsPorDni.set(dni, pasajero.id);
      }
    }

    const viajePasajeroIds: number[] = [];
    const dnisNoEncontrados: string[] = [];

    for (const dni of dnisNormalizados) {
      const id = idsPorDni.get(dni);
      if (id) {
        viajePasajeroIds.push(id);
      } else {
        dnisNoEncontrados.push(dni);
      }
    }

    if (dnisNoEncontrados.length > 0) {
      throw new NotFoundException(`No se encontraron estos DNIs en el viaje ${viajeId}: ${dnisNoEncontrados.join(', ')}`);
    }

    return this.abordarPasajeros(viajePasajeroIds, tramoId);
  }

  async escanearDnis(viajeId: number, dto: ViajeEscanearDnisDto, tramoId: number): Promise<ViajeEscanearDnisResultDto> {
    const resultados: ScanDniResultItem[] = [];
    const idsCámara: number[] = [];
    const currentPasajeros = await this.viajePasajeroRepository.findByViajeId(viajeId);

    for (const url of dto.urls) {
      const data = await this.geminiAiService.extractDniData(url);
      if (!data) {
        resultados.push({ url, matched: false, status: 'ERROR_OCR', error: 'No se pudo extraer información', viajeTramoId: null });
        continue;
      }

      let vpid: number;
      let status: string;
      const existing = currentPasajeros.find((p) => p.dni === data.dni);

      if (existing) {
        vpid = existing.id;
        status = 'EXISTENTE_EN_VIAJE';
      } else {
        const global = await this.pasajeroRepository.findOneByDni(data.dni);
        const [added] = await this.viajePasajeroRepository.addPasajeros([
          {
            viajeId,
            pasajeroId: global?.id || null,
            dni: global ? null : data.dni,
            nombres: global ? null : data.nombres,
            apellidos: global ? null : data.apellidos,
            asistencia: false,
          },
        ]);
        vpid = added.id;
        status = global ? 'AGREGADO_DESDE_SISTEMA' : 'CREADO_AD_HOC';
      }

      idsCámara.push(vpid);
      resultados.push({ ...data, matched: true, status, viajeTramoId: tramoId });
    }

    // Para no desabordar a los que ya estaban, unimos los detectados con los actuales del tramo
    const currentInTramo = await this.viajePasajeroMovimientoRepository.findByViajeTramo(tramoId);
    const existingIds = currentInTramo.filter((m) => m.tipoMovimiento === 'entrada').map((m) => m.viajePasajeroId);
    const idsAAbordar = Array.from(new Set([...existingIds, ...idsCámara]));

    if (idsAAbordar.length > 0) {
      await this.abordarPasajeros(idsAAbordar, tramoId);
    }

    return {
      exito: true,
      mensaje: 'Procesamiento de DNIs completado',
      resultados,
      pasajerosActualizados: await this.findPasajeros(viajeId),
    };
  }

  async getProximoTramo(viajeId: number, tipo?: ViajeTramoTipo): Promise<ViajeProximoTramoResultDto> {
    const viajeInfo = await this.viajeRepository.findOne(viajeId);
    if (!viajeInfo) throw new NotFoundException('Viaje no encontrado');

    const tramos = await this.viajeTramoRepository.findByViajeId(viajeId);
    const lastTramo = tramos.length > 0 ? tramos[tramos.length - 1] : null;
    // Para kilometraje y pasajeros, ignorar descansos (no tienen esos datos)
    const lastTramoReal = [...tramos].reverse().find((s) => s.tipo !== 'descanso') || null;

    // Valores por defecto basados en el viaje o el último tramo real (no descanso)
    let ultimoKilometraje = lastTramoReal?.kilometrajeFinal || 0;
    let ultimaHora = lastTramo?.horaFinal || viajeInfo.fechaSalida || viajeInfo.fechaSalidaProgramada;

    // Si es el primer tramo (no hay tramos), buscamos el kilometraje actual del vehículo
    if (tramos.length === 0) {
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
      latitud: lastTramo?.latitud != null ? lastTramo.latitud.toString() : null,
      longitud: lastTramo?.longitud != null ? lastTramo.longitud.toString() : null,
      ultimoKilometraje,
      ultimaHora: (ultimaHora as Date) || new Date(),
      ultimosPasajeros: lastTramoReal?.numeroPasajeros || 0,
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
      const hasSalida = tramos.some((s) => s.tipo === 'origen');
      const hasLlegada = tramos.some((s) => s.tipo === 'destino');

      // Si la ruta tiene un destino coordenado, el último punto es el destino final, si no (ruta abierta), todos los puntos después del origen son puntos de control.
      const isRutaAbierta = !viajeInfo.ruta.destinoLat;
      const puntosControlRuta = isRutaAbierta
        ? paradasRuta.length > 1
          ? paradasRuta.slice(1)
          : []
        : paradasRuta.length > 2
          ? paradasRuta.slice(1, -1)
          : [];

      const IDsRegistrados = new Set(tramos.filter((s) => s.rutaParadaId).map((s) => s.rutaParadaId));
      const nombresRegistrados = new Set(tramos.filter((s) => s.nombreLugar).map((s) => s.nombreLugar.trim().toLowerCase()));

      const puntosControlFaltantes = puntosControlRuta.filter(
        (p) => !IDsRegistrados.has(p.id) && !nombresRegistrados.has(p.nombre.trim().toLowerCase()),
      );

      // "faltanPuntosFijos" se refiere específicamente a los puntos de control (intermedios)
      result.faltanPuntosFijos = puntosControlFaltantes.length > 0;

      // 1. Si no hay salida registrada, sugerir siempre el origen
      if (!hasSalida) {
        result.tipo = 'origen';
        result.nombreLugar = viajeInfo.ruta.origen;
        result.latitud = viajeInfo.ruta.origenLat;
        result.longitud = viajeInfo.ruta.origenLng;
        result.esPuntoFijo = true;
        result.rutaParadaId = paradasRuta.length > 0 ? paradasRuta[0].id : null;
        return result;
      }

      // 2. Si faltan puntos de control, sugerir el primero faltante
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

      // 3. Si todo lo anterior está listo, sugerir llegada (si existe) o dejar punto abierto
      if (!hasLlegada) {
        if (viajeInfo.ruta.destino) {
          result.tipo = 'destino';
          result.nombreLugar = viajeInfo.ruta.destino;
          result.latitud = viajeInfo.ruta.destinoLat;
          result.longitud = viajeInfo.ruta.destinoLng;
          result.esPuntoFijo = true;
          // Asumir que el último elemento guardado en paradas estructuradas era el destino
          result.rutaParadaId = paradasRuta.length > 1 ? paradasRuta[paradasRuta.length - 1].id : null;
          result.faltanPuntosFijos = false;
          return result;
        } else {
          result.tipo = 'parada';
          result.nombreLugar = null;
          result.latitud = null;
          result.longitud = null;
          result.esPuntoFijo = false;
          result.faltanPuntosFijos = false;
          return result;
        }
      }

      // 4. Si hay salida, puntos de control y llegada -> COMPLETADO
      result.tipo = 'parada';
      result.nombreLugar = null;
      result.latitud = null;
      result.longitud = null;
      result.esPuntoFijo = false;
      result.faltanPuntosFijos = false;
      return result;
    }

    // Si no hay ruta fija (ruta ocasional/dinámica)
    const hasSalidaOcasional = tramos.some((s) => s.tipo === 'origen');
    const hasLlegadaOcasional = tramos.some((s) => s.tipo === 'destino');

    // Si ya tiene llegada -> viaje completado
    if (hasLlegadaOcasional) {
      result.tipo = 'parada';
      result.nombreLugar = null;
      result.latitud = null;
      result.longitud = null;
      result.esPuntoFijo = false;
      result.faltanPuntosFijos = false;
      return result;
    }

    // Si no tiene salida, sugerir origen con el nombre de la ruta ocasional
    if (!hasSalidaOcasional) {
      result.tipo = 'origen';
      result.nombreLugar = viajeInfo.rutaOcasional || null;
      result.latitud = null;
      result.longitud = null;
      result.esPuntoFijo = false;
      return result;
    }

    // Si tiene salida pero no llegada, sugerir parada (el conductor decide si es parada o llegada)
    result.tipo = 'parada';
    result.nombreLugar = null;
    result.latitud = null;
    result.longitud = null;
    result.esPuntoFijo = false;
    result.faltanPuntosFijos = false;
    return result;
  }

  async validarVehiculo(query: ValidarVehiculoQueryDto): Promise<ValidacionResultDto> {
    const vehiculo = await this.vehiculoRepository.findOne(query.vehiculoId);
    if (!vehiculo) {
      return { status: false, message: 'Vehículo no encontrado.' };
    }

    if (vehiculo.estado === 'retirado') {
      return { status: false, message: 'El vehículo se encuentra retirado de circulación.' };
    }

    const { fechaSalida, fechaLlegada, viajeId } = query;

    // 1. Validar alquileres cruzados
    const activeAlquileres = await this.alquilerRepository.findActivosByVehiculo(query.vehiculoId);

    const vSalida = new Date(fechaSalida);
    const vLlegada = new Date(fechaLlegada);

    for (const alq of activeAlquileres) {
      const aInicio = new Date(alq.fechaInicio);
      const aFin = alq.fechaFin ? new Date(alq.fechaFin) : null;

      const overlap = aFin ? aInicio <= vLlegada && aFin >= vSalida : aInicio <= vLlegada;

      if (overlap) {
        return {
          status: false,
          message: `El vehículo está alquilado desde el ${aInicio.toLocaleDateString()} hasta ${aFin ? aFin.toLocaleDateString() : 'indefinidamente'}, por lo que cruza con este horario.`,
        };
      }
    }

    // 2. Validar mantenimientos (si hay un mantenimiento pendiente/en_proceso que cruce con el viaje)
    const activeMantenimientos = await this.mantenimientoRepository.findCruzadosPorVehiculo(
      query.vehiculoId,
      new Date(fechaSalida),
      new Date(fechaLlegada),
    );

    if (activeMantenimientos.length > 0) {
      return { status: false, message: `El vehículo tiene un mantenimiento programado/en proceso que cruza con este horario.` };
    }

    // 3. Validar viajes que cruzan (excluyendo el viajeId actual si se envía)
    const viajesCruzados = await this.viajeRepository.findCruzadosPorVehiculo(
      query.vehiculoId,
      new Date(fechaSalida),
      new Date(fechaLlegada),
      viajeId,
    );

    if (viajesCruzados.length > 0) {
      return {
        status: false,
        message: `El vehículo ya tiene ${viajesCruzados.length} viaje(s) asignado(s) que se cruza(n) con el horario programado.`,
      };
    }

    // 4. Validar documentos vencidos del vehiculo
    const docs = await this.vehiculoDocumentoRepository.findByVehiculoId(query.vehiculoId);

    // Si la fecha de expiracion del documento es menor a la fecha de llegada de este viaje,
    // significa que el documento caducará durante (o antes) del viaje
    for (const d of docs) {
      if (d.fechaExpiracion && new Date(d.fechaExpiracion) < new Date(fechaLlegada)) {
        return {
          status: false,
          message: `El documento "${d.nombre}" expirará el ${new Date(d.fechaExpiracion).toLocaleDateString()}, y no cubre todo el horario del viaje.`,
        };
      }
    }

    return { status: true, message: 'El vehículo está disponible y habilitado.' };
  }

  async validarConductor(query: ValidarConductorQueryDto): Promise<ValidacionResultDto> {
    const conductor = await this.conductorRepository.findOne(query.conductorId);
    if (!conductor) {
      return { status: false, message: 'Conductor no encontrado.' };
    }

    const { fechaSalida, fechaLlegada, viajeId } = query;

    // 1. Validar documentos vencidos del conductor
    const docs = await this.conductorDocumentoRepository.findByConductorId(query.conductorId);

    for (const d of docs) {
      if (d.fechaExpiracion && new Date(d.fechaExpiracion) < new Date(fechaLlegada)) {
        return {
          status: false,
          message: `El documento del conductor "${d.nombre}" expirará el ${new Date(d.fechaExpiracion).toLocaleDateString()}, y no cubre todo el horario del viaje.`,
        };
      }
    }

    // 2. Validar viajes que cruzan
    const viajesCruzados = await this.viajeRepository.findCruzadosPorConductor(
      query.conductorId,
      new Date(fechaSalida),
      new Date(fechaLlegada),
      viajeId,
    );

    if (viajesCruzados.length > 0) {
      return {
        status: false,
        message: `El conductor ya tiene ${viajesCruzados.length} viaje(s) asignado(s) que se cruza(n) con el horario programado.`,
      };
    }

    return { status: true, message: 'El conductor está disponible y habilitado.' };
  }
}
