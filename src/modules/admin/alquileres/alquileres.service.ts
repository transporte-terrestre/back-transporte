import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AlquilerRepository } from '@repository/alquiler.repository';
import { AlquilerCreateDto } from './dto/alquiler/alquiler-create.dto';
import { AlquilerUpdateDto } from './dto/alquiler/alquiler-update.dto';
import { AlquilerQueryDto, AlquilerListDto } from './dto/alquiler/alquiler-list.dto';
import { AlquilerResultDto } from './dto/alquiler/alquiler-result.dto';
import { AlquilerTerminarDto } from './dto/alquiler/alquiler-terminar.dto';
import { AlquilerDocumentoRepository } from '@repository/alquiler-documento.repository';
import { AlquilerDocumentoCreateDto } from './dto/alquiler-documento/alquiler-documento-create.dto';
import { AlquilerDocumentoUpdateDto } from './dto/alquiler-documento/alquiler-documento-update.dto';
import { AlquilerDocumentoResultDto } from './dto/alquiler-documento/alquiler-documento-result.dto';

import { VehiculoRepository } from '@repository/vehiculo.repository';
import { MantenimientoRepository } from '@repository/mantenimiento.repository';
import { ViajeRepository } from '@repository/viaje.repository';
import { VehiculoDocumentoRepository } from '@repository/vehiculo-documento.repository';
import { ValidarVehiculoAlquilerQueryDto } from './dto/alquiler/validar-vehiculo-alquiler-query.dto';
import { ValidacionAlquilerResultDto } from './dto/alquiler/validacion-alquiler-result.dto';
import { AlquilerDetalleRepository } from '@repository/alquiler-detalle.repository';
import { AlquilerHistorialRepository } from '@repository/alquiler-historial.repository';

@Injectable()
export class AlquileresService {
  constructor(
    private readonly alquilerRepository: AlquilerRepository,
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly alquilerDocumentoRepository: AlquilerDocumentoRepository,
    private readonly mantenimientoRepository: MantenimientoRepository,
    private readonly viajeRepository: ViajeRepository,
    private readonly vehiculoDocumentoRepository: VehiculoDocumentoRepository,
    private readonly alquilerDetalleRepository: AlquilerDetalleRepository,
    private readonly alquilerHistorialRepository: AlquilerHistorialRepository,
  ) {}

  async findAll(query: AlquilerQueryDto): Promise<AlquilerListDto> {
    const { page = 1, limit = 10, ...filters } = query;
    const { data, total } = await this.alquilerRepository.findAllPaginated(page, limit, filters);

    // Fetch and attach details for all items in the current page
    if (data.length > 0) {
      const ids = data.map((item) => item.id);
      const allDetalles = await this.alquilerDetalleRepository.findByAlquilerIds(ids);

      data.forEach((item) => {
        (item as any).detalles = allDetalles.filter((d) => d.alquilerId === item.id);
      });
    }

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as any,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: number): Promise<AlquilerResultDto> {
    const alquiler = await this.alquilerRepository.findOne(id);
    if (!alquiler) {
      throw new NotFoundException(`Alquiler con ID ${id} no encontrado`);
    }

    const documentos = await this.alquilerDocumentoRepository.findByAlquilerId(id);
    const detalles = await this.alquilerDetalleRepository.findByAlquilerId(id);
    const historial = await this.alquilerHistorialRepository.findByAlquilerId(id);

    return {
      ...alquiler,
      documentos,
      detalles,
      historial,
    };
  }

  async create(data: AlquilerCreateDto): Promise<AlquilerResultDto> {
    const { marcarComoAlquilado, vehiculos: vehiculosData, ...rest } = data;

    // 1. Crear Maestro
    const alquiler = await this.alquilerRepository.create({
      ...rest,
      fechaInicio: new Date(rest.fechaInicio),
      fechaFin: rest.fechaFin ? new Date(rest.fechaFin) : null,
    });
    const id = alquiler.id;

    // 2. Crear Detalles e Historial
    for (const vData of vehiculosData) {
      await this.alquilerDetalleRepository.create({
        alquilerId: id,
        vehiculoId: vData.vehiculoId,
        conductorId: vData.conductorId || null,
        tipo: vData.tipo,
        kilometrajeInicial: vData.kilometrajeInicial,
      });

      // Historial de alta
      await this.alquilerHistorialRepository.create({
        alquilerId: id,
        vehiculoId: vData.vehiculoId,
        tipoAccion: 'ALTA_VEHICULO',
        motivo: 'Alta inicial en contrato corporativo',
        fechaAccion: new Date(),
      });

      if (marcarComoAlquilado) {
        await this.vehiculoRepository.update(vData.vehiculoId, { estado: 'alquilado' });
      }
    }

    return this.findOne(id);
  }

  async update(id: number, data: AlquilerUpdateDto): Promise<AlquilerResultDto> {
    const prev = await this.findOne(id);
    const { marcarComoAlquilado, vehiculos: vehiculosData, ...payload } = data;

    // 1. Verificar cambio de precio para el historial
    if (payload.montoPorDia !== undefined && payload.montoPorDia !== prev.montoPorDia) {
      await this.alquilerHistorialRepository.create({
        alquilerId: id,
        tipoAccion: 'CAMBIO_PRECIO',
        montoAnterior: prev.montoPorDia,
        montoNuevo: payload.montoPorDia,
        motivo: 'Actualización de tarifa contractual',
        fechaAccion: new Date(),
      });
    }

    // 2. Actualizar Maestro
    await this.alquilerRepository.update(id, {
      ...payload,
      fechaInicio: payload.fechaInicio ? new Date(payload.fechaInicio) : undefined,
      fechaFin: payload.fechaFin ? new Date(payload.fechaFin) : undefined,
    });

    // 3. Manejar vehículos si se envían (esto podría ser más complejo para detectar adiciones/eliminaciones)
    // Por ahora, si se envían vehículos nuevos que no están, los agregamos.
    if (vehiculosData) {
      for (const vData of vehiculosData) {
        const exist = prev.detalles?.find((d) => d.vehiculoId === vData.vehiculoId);
        if (!exist) {
          await this.alquilerDetalleRepository.create({
            alquilerId: id,
            vehiculoId: vData.vehiculoId,
            conductorId: vData.conductorId || null,
            tipo: vData.tipo,
            kilometrajeInicial: vData.kilometrajeInicial,
          });

          await this.alquilerHistorialRepository.create({
            alquilerId: id,
            vehiculoId: vData.vehiculoId,
            tipoAccion: 'ALTA_VEHICULO',
            motivo: 'Adición de vehículo al contrato',
            fechaAccion: new Date(),
          });

          if (marcarComoAlquilado) {
            await this.vehiculoRepository.update(vData.vehiculoId, { estado: 'alquilado' });
          }
        }
      }
    }

    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.alquilerRepository.delete(id);
  }

  async terminar(id: number, data: AlquilerTerminarDto): Promise<AlquilerResultDto> {
    const prev = await this.findOne(id);
    if (prev.estado === 'finalizado') throw new BadRequestException('El contrato ya está finalizado.');

    // 1. Actualizar kilometrajes de las unidades específicas
    if (data.detalles && data.detalles.length > 0) {
      for (const item of data.detalles) {
        const detalle = await this.alquilerDetalleRepository.findOne(item.detalleId);
        if (!detalle) throw new NotFoundException(`Detalle de alquiler con ID ${item.detalleId} no encontrado.`);
        if (detalle.alquilerId !== id) throw new BadRequestException(`El detalle ${item.detalleId} no pertenece al alquiler ${id}.`);

        // Validar kilometraje
        const kmInicial = Number(detalle.kilometrajeInicial);
        const kmFinal = Number(item.kilometrajeFinal);
        if (item.kilometrajeFinal != null && Number.isFinite(kmInicial) && Number.isFinite(kmFinal) && kmFinal < kmInicial) {
          throw new BadRequestException(`El kilometraje final no puede ser menor al inicial para el vehículo asignado.`);
        }

        if (item.kilometrajeFinal != null) {
          await this.alquilerDetalleRepository.update(item.detalleId, {
            kilometrajeFinal: item.kilometrajeFinal,
          });

          await this.vehiculoRepository.update(detalle.vehiculoId, {
            estado: 'disponible',
            kilometraje: item.kilometrajeFinal,
          });
        }
      }
    }

    // 2. Finalizar todas las unidades que aún no han sido finalizadas
    const currentDetalles = await this.alquilerDetalleRepository.findByAlquilerId(id);
    if (currentDetalles?.length) {
      for (const detalle of currentDetalles) {
        // Validamos si ya se procesó en el paso 1
        const fueProcesado = data.detalles?.some(d => d.detalleId === detalle.id && d.kilometrajeFinal != null);
        
        if (!fueProcesado) {
          if (detalle.kilometrajeFinal == null) {
            // Actualizar vehículo a disponible si no tenía kilometraje final asignado previamente
            await this.vehiculoRepository.update(detalle.vehiculoId, {
              estado: 'disponible',
            });
          }
        }

        // Historial de baja para todas las unidades al finalizar contrato
        if (detalle.kilometrajeFinal == null || fueProcesado) {
          await this.alquilerHistorialRepository.create({
            alquilerId: id,
            vehiculoId: detalle.vehiculoId,
            tipoAccion: 'BAJA_VEHICULO',
            motivo: data.observaciones || 'Finalización del contrato maestro',
            fechaAccion: new Date(),
          });
        }
      }
    }

    // 3. Finalizar el contrato maestro
    await this.alquilerRepository.update(id, {
      estado: 'finalizado',
      fechaFin: data.fechaFin || new Date(),
      montoTotalFinal: data.montoTotalFinal,
      observaciones: data.observaciones || prev.observaciones || null,
    });

    return this.findOne(id);
  }

  // ========== DOCUMENTOS ==========
  async findDocumento(id: number): Promise<AlquilerDocumentoResultDto> {
    const doc = await this.alquilerDocumentoRepository.findOne(id);
    if (!doc) throw new NotFoundException(`Documento de alquiler con ID ${id} no encontrado`);
    return doc;
  }

  async createDocumento(data: AlquilerDocumentoCreateDto): Promise<AlquilerDocumentoResultDto> {
    await this.findOne(data.alquilerId);
    return await this.alquilerDocumentoRepository.create({
      ...data,
      tipo: data.tipo || 'otros',
    });
  }

  async updateDocumento(id: number, data: AlquilerDocumentoUpdateDto): Promise<AlquilerDocumentoResultDto> {
    await this.findDocumento(id);
    return await this.alquilerDocumentoRepository.update(id, data);
  }

  async deleteDocumento(id: number): Promise<AlquilerDocumentoResultDto> {
    await this.findDocumento(id);
    return await this.alquilerDocumentoRepository.delete(id);
  }

  async validarVehiculo(query: ValidarVehiculoAlquilerQueryDto): Promise<ValidacionAlquilerResultDto> {
    const vehiculo = await this.vehiculoRepository.findOne(query.vehiculoId);
    if (!vehiculo) {
      return { status: false, message: 'Vehículo no encontrado.' };
    }

    if (vehiculo.estado === 'taller') {
      return { status: false, message: 'El vehículo se encuentra en taller e inoperativo.' };
    }

    if (vehiculo.estado === 'retirado') {
      return { status: false, message: 'El vehículo se encuentra retirado de circulación.' };
    }

    const { fechaInicio, fechaFin, alquilerId } = query;
    const vInicio = new Date(fechaInicio);
    const vFin = fechaFin ? new Date(fechaFin) : new Date(vInicio.getTime() + 1000 * 60 * 60 * 24 * 365); // 1 year if not set

    // 1. Validar alquileres cruzados usando los detalles
    const activeDetalles = await this.alquilerDetalleRepository.findActiveByVehiculo(query.vehiculoId);

    for (const det of activeDetalles) {
      if (alquilerId && det.alquilerId === alquilerId) continue;

      // Necesito las fechas del maestro para comparar si el detalle no las tiene
      const alq = await this.alquilerRepository.findOne(det.alquilerId);
      if (!alq) continue;

      const aInicio = new Date(alq.fechaInicio);
      const aFin = alq.fechaFin ? new Date(alq.fechaFin) : null;

      const overlap = aFin ? aInicio <= vFin && aFin >= vInicio : aInicio <= vFin;

      if (overlap) {
        return {
          status: false,
          message: `El vehículo ya está alquilado desde el ${aInicio.toLocaleDateString()} hasta ${aFin ? aFin.toLocaleDateString() : 'indefinidamente'}, por lo que cruza con este horario.`,
        };
      }
    }

    // 2. Validar mantenimientos
    const activeMantenimientos = await this.mantenimientoRepository.findCruzadosPorVehiculo(
      query.vehiculoId,
      vInicio,
      vFin,
    );

    if (activeMantenimientos.length > 0) {
      return { status: false, message: `El vehículo tiene un mantenimiento programado/en proceso que cruza con este horario.` };
    }

    // 3. Validar viajes
    const viajesCruzados = await this.viajeRepository.findCruzadosPorVehiculo(
      query.vehiculoId,
      vInicio,
      vFin,
    );

    if (viajesCruzados.length > 0) {
      return {
        status: false,
        message: `El vehículo ya tiene ${viajesCruzados.length} viaje(s) asignado(s) que se cruza(n) con el horario del alquiler.`,
      };
    }

    // 4. Validar documentos vencidos
    const docs = await this.vehiculoDocumentoRepository.findByVehiculoId(query.vehiculoId);
    for (const d of docs) {
      if (d.fechaExpiracion && new Date(d.fechaExpiracion) < vFin) {
        return {
          status: false,
          message: `El documento "${d.nombre}" expirará el ${new Date(d.fechaExpiracion).toLocaleDateString()}, y no cubre todo el periodo del alquiler.`,
        };
      }
    }

    return { status: true, message: 'El vehículo está disponible y habilitado.' };
  }
}
