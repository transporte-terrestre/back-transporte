import { Injectable, NotFoundException } from '@nestjs/common';
import { MantenimientoRepository } from '@repository/mantenimiento.repository';
import { TareaRepository } from '@repository/tarea.repository';
import { MantenimientoCreateDto } from './dto/mantenimiento/mantenimiento-create.dto';
import { MantenimientoUpdateDto } from './dto/mantenimiento/mantenimiento-update.dto';
import { PaginatedMantenimientoResultDto } from './dto/mantenimiento/mantenimiento-paginated.dto';
import { PaginatedTareaResultDto } from './dto/tarea/tarea-paginated.dto';
import { TareaCreateDto } from './dto/tarea/tarea-create.dto';
import { TareaUpdateDto } from './dto/tarea/tarea-update.dto';
import { MantenimientoTareaCreateDto } from './dto/mantenimiento-tarea/mantenimiento-tarea-create.dto';
import { MantenimientoTareaUpdateDto } from './dto/mantenimiento-tarea/mantenimiento-tarea-update.dto';
import { MantenimientoDocumentoCreateDto } from './dto/mantenimiento-documento/mantenimiento-documento-create.dto';
import { MantenimientoDocumentoUpdateDto } from './dto/mantenimiento-documento/mantenimiento-documento-update.dto';
import { MantenimientoReporteEstadoDto, PaginatedReporteEstadoResultDto } from './dto/mantenimiento/mantenimiento-reporte-estado.dto';

import { MantenimientoDocumentoDTO, mantenimientoDocumentosTipo } from '@db/tables/mantenimiento-documento.table';
import { DocumentosAgrupadosMantenimientoDto } from './dto/mantenimiento/mantenimiento-result.dto';

import { VehiculoRepository } from '@repository/vehiculo.repository';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

@Injectable()
export class MantenimientosService {
  constructor(
    private readonly mantenimientoRepository: MantenimientoRepository,
    private readonly tareaRepository: TareaRepository,
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    tipo?: string,
    estado?: string,
    tallerId?: number,
    vehiculoId?: number,
  ): Promise<PaginatedMantenimientoResultDto> {
    const { data, total } = await this.mantenimientoRepository.findAllPaginated(page, limit, {
      search,
      fechaInicio,
      fechaFin,
      tipo,
      estado,
      tallerId,
      vehiculoId,
    });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: data.map((item) => ({
        ...item,
        taller: item.taller ? { ...item.taller, sucursalIds: [] as number[] } : null,
      })),
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

  async getReporteEstadoVehiculos(
    page: number = 1,
    limit: number = 10,
    sort: 'proximos' | 'ultimos' = 'proximos',
    vehiculoId?: number,
  ): Promise<PaginatedReporteEstadoResultDto> {
    const { data: rawData, total } = await this.mantenimientoRepository.getReporteEstadoVehiculos(page, limit, sort, vehiculoId);

    const data = rawData.map((row) => {
      const actual = Number(row.kilometraje_actual || 0);
      const prox = row.prox_mantenimiento_km ? Number(row.prox_mantenimiento_km) : null;

      let restante = null;
      let estado = 'n/a';

      if (prox !== null) {
        restante = prox - actual;
        if (restante > 1000) {
          estado = 'verde';
        } else if (restante > 0) {
          estado = 'amarillo';
        } else {
          // restante <= 0
          estado = 'rojo';
        }
      }

      return {
        vehiculoId: row.id,
        placa: row.placa,
        codigoInterno: row.codigo_interno || null,
        imagenes: row.imagenes,
        kilometrajeActual: actual,
        ultimoMantenimientoFecha: row.ultimo_mantenimiento_fecha ? new Date(row.ultimo_mantenimiento_fecha) : null,
        ultimoMantenimientoKm: row.ultimo_mantenimiento_km ? Number(row.ultimo_mantenimiento_km) : null,
        proxMantenimientoKm: prox,
        kilometrajeRestante: restante,
        restante: restante,
        estado: estado,
      };
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
    const maintenance = await this.mantenimientoRepository.findOne(id);
    if (!maintenance) return null;

    // Group documents by type
    const documentosAgrupados = mantenimientoDocumentosTipo.enumValues.reduce((acc, tipo) => {
      acc[tipo] = maintenance.documentos.filter((doc) => doc.tipo === tipo);
      return acc;
    }, {} as DocumentosAgrupadosMantenimientoDto);

    return {
      ...maintenance,
      documentos: documentosAgrupados,
    };
  }

  async create(data: MantenimientoCreateDto) {
    const { marcarEnTaller, ...rest } = data;
    const codigoOrden = await this.generarCodigoOrden(rest.vehiculoId);
    const result = await this.mantenimientoRepository.create({ ...rest, codigoOrden });

    if (marcarEnTaller) {
      await this.vehiculoRepository.update(rest.vehiculoId, { estado: 'taller' });
    }

    return result;
  }

  private async generarCodigoOrden(vehiculoId: number): Promise<string> {
    const placa = await this.mantenimientoRepository.getPlacaVehiculo(vehiculoId);

    if (!placa) {
      throw new NotFoundException(`Vehículo con id ${vehiculoId} no encontrado`);
    }

    const count = await this.mantenimientoRepository.countMantenimientosActivos(vehiculoId);
    const numero = count + 1;
    const numeroFormateado = String(numero).padStart(5, '0');

    return `${placa}-${numeroFormateado}`;
  }

  async update(id: number, data: MantenimientoUpdateDto) {
    const prev = await this.findOne(id);
    const { marcarEnTaller, ...rest } = data;
    const result = await this.mantenimientoRepository.update(id, rest);

    if (marcarEnTaller && prev) {
      await this.vehiculoRepository.update(rest.vehiculoId || prev.vehiculoId, { estado: 'taller' });
    }

    return result;
  }

  delete(id: number) {
    return this.mantenimientoRepository.delete(id);
  }

  // ========== MANTENIMIENTO TAREAS (relación) ==========
  createMantenimientoTarea(data: MantenimientoTareaCreateDto) {
    return this.mantenimientoRepository.createTarea(data);
  }

  updateMantenimientoTarea(id: number, data: MantenimientoTareaUpdateDto) {
    return this.mantenimientoRepository.updateTarea(id, data);
  }

  deleteMantenimientoTarea(id: number) {
    return this.mantenimientoRepository.deleteTarea(id);
  }

  // ========== CATÁLOGO DE TAREAS ==========
  async findAllTareasPaginated(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedTareaResultDto> {
    const { data, total } = await this.tareaRepository.findAllPaginated(page, limit, { search });

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
  async findDocumento(id: number) {
    return this.mantenimientoRepository.findDocumento(id);
  }

  createDocumento(data: MantenimientoDocumentoCreateDto) {
    return this.mantenimientoRepository.createDocumento(data);
  }

  updateDocumento(id: number, data: MantenimientoDocumentoUpdateDto) {
    return this.mantenimientoRepository.updateDocumento(id, data);
  }

  deleteDocumento(id: number) {
    return this.mantenimientoRepository.deleteDocumento(id);
  }

  async verificarYGenerarMantenimiento(vehiculoId: number) {
    const vehiculo = await this.vehiculoRepository.findOne(vehiculoId);
    if (!vehiculo || !vehiculo.kilometrajeMantenimiento) return;

    const ultimoMant = await this.mantenimientoRepository.findLatestByVehiculo(vehiculoId);

    // CASO 1: No hay ningún mantenimiento registrado
    if (!ultimoMant) {
      await this.generarNuevoMantenimiento(vehiculoId, 'preventivo', 'Generado automáticamente: Primer mantenimiento programado.');
      return;
    }

    if (ultimoMant.estado === 'en_proceso') return;

    if (ultimoMant.estado === 'finalizado') {
      // Si el intervalo de mantenimiento del vehículo cambió, actualizamos el km próximo del último mantenimiento
      const intervaloActual = Number(vehiculo.kilometrajeMantenimiento || 0);
      const kmBase = Number(ultimoMant.kilometraje || 0);
      const nuevoKmProximoEsperado = kmBase + intervaloActual;
      const kmProximoActual = Number(ultimoMant.kilometrajeProximoMantenimiento || 0);

      if (intervaloActual > 0 && kmProximoActual !== nuevoKmProximoEsperado) {
        await this.mantenimientoRepository.update(ultimoMant.id, {
          kilometrajeProximoMantenimiento: nuevoKmProximoEsperado,
        });
        ultimoMant.kilometrajeProximoMantenimiento = nuevoKmProximoEsperado; // Actualizar localmente para la siguiente lógica
      }

      // Revisar si ya le toca el siguiente basado en el intervalo
      const kmActual = Number(vehiculo.kilometraje);
      const kmProximoProgramado = Number(ultimoMant.kilometrajeProximoMantenimiento || 0);

      // Si el kilometraje actual superó o igualó al programado, creamos uno nuevo
      if (kmActual >= kmProximoProgramado) {
        await this.generarNuevoMantenimiento(
          vehiculoId,
          'preventivo',
          `Generado automáticamente: Superado KM programado (${kmProximoProgramado} km).`,
        );

        await this.notificacionesService.create({
          titulo: `Nuevo Mantenimiento Programado: ${vehiculo.placa}`,
          mensaje: `Se ha creado un nuevo mantenimiento para ${vehiculo.placa} al alcanzar ${kmActual} KM.`,
          tipo: 'info',
          metadata: { entidad: 'vehiculo', id: vehiculoId },
        });
      }
    } else if (ultimoMant.estado === 'pendiente') {
      const kmActualVehiculo = Number(vehiculo.kilometraje || 0);
      const intervaloActual = Number(vehiculo.kilometrajeMantenimiento || 0);
      const nuevoKmProximoEsperado = kmActualVehiculo + intervaloActual;

      await this.mantenimientoRepository.update(ultimoMant.id, {
        kilometraje: kmActualVehiculo,
        kilometrajeProximoMantenimiento: nuevoKmProximoEsperado,
      });

      // Ya hay uno pendiente, notificar
      await this.notificacionesService.create({
        titulo: `Mantenimiento Pendiente: ${vehiculo.placa}`,
        mensaje: `El vehículo ${vehiculo.placa} tiene un mantenimiento pendiente.`,
        tipo: 'warning',
        metadata: { entidad: 'vehiculo', id: vehiculoId },
      });
      return;
    }
  }

  private async generarNuevoMantenimiento(vehiculoId: number, tipo: 'preventivo' | 'correctivo', descripcion: string) {
    const vehiculo = await this.vehiculoRepository.findOne(vehiculoId);
    if (!vehiculo) return;

    const kmActual = Number(vehiculo.kilometraje);
    const intervalo = Number(vehiculo.kilometrajeMantenimiento || 500);
    const kmProximo = kmActual + intervalo;

    const codigoOrden = await this.generarCodigoOrden(vehiculoId);

    // Taller opcional: buscamos el último taller usado pero no forzamos id 1 ni error
    const ultimo = await this.mantenimientoRepository.findLatestByVehiculo(vehiculoId);
    const tallerId = ultimo?.tallerId || null;

    return await this.mantenimientoRepository.create({
      vehiculoId,
      tallerId,
      tipo,
      descripcion,
      fechaIngreso: new Date(),
      kilometraje: kmActual,
      kilometrajeProximoMantenimiento: kmProximo,
      estado: 'pendiente',
      codigoOrden,
      costoTotal: '0',
    });
  }
}
