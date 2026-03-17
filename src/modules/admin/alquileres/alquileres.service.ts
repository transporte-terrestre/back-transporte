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

@Injectable()
export class AlquileresService {
  constructor(
    private readonly alquilerRepository: AlquilerRepository,
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly alquilerDocumentoRepository: AlquilerDocumentoRepository,
    private readonly mantenimientoRepository: MantenimientoRepository,
    private readonly viajeRepository: ViajeRepository,
    private readonly vehiculoDocumentoRepository: VehiculoDocumentoRepository,
  ) {}

  async findAll(query: AlquilerQueryDto): Promise<AlquilerListDto> {
    const { page = 1, limit = 10, ...filters } = query;
    const { data, total } = await this.alquilerRepository.findAllPaginated(page, limit, filters);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
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

    return {
      ...alquiler,
      documentos,
    };
  }

  async create(data: AlquilerCreateDto): Promise<AlquilerResultDto> {
    if (data.tipo === 'maquina_operada' && !data.conductorId) {
      throw new BadRequestException('Para alquiler tipo maquina_operada debe enviar conductorId.');
    }

    if (data.tipo === 'maquina_seca' && data.conductorId) {
      throw new BadRequestException('Para alquiler tipo maquina_seca no debe enviar conductorId.');
    }

    const { marcarComoAlquilado, ...rest } = data;
    const payload = {
      ...rest,
      conductorId: data.tipo === 'maquina_seca' ? null : rest.conductorId,
      fechaFin: null,
    };
    const alquiler = await this.alquilerRepository.create(payload);
    const id = alquiler.id;

    if (marcarComoAlquilado) {
      await this.vehiculoRepository.update(rest.vehiculoId, { estado: 'alquilado' });
    }

    return this.findOne(id);
  }

  async update(id: number, data: AlquilerUpdateDto): Promise<AlquilerResultDto> {
    const prev = await this.findOne(id);
    const { marcarComoAlquilado, ...payload } = data;

    const tipoFinal = data.tipo || prev.tipo;
    const conductorFinal = data.conductorId !== undefined ? data.conductorId : prev.conductorId;

    if (tipoFinal === 'maquina_operada' && !conductorFinal) {
      throw new BadRequestException('Para alquiler tipo maquina_operada debe enviar conductorId.');
    }

    if (tipoFinal === 'maquina_seca' && conductorFinal) {
      throw new BadRequestException('Para alquiler tipo maquina_seca no debe enviar conductorId.');
    }

    await this.alquilerRepository.update(id, {
      ...payload,
      conductorId: tipoFinal === 'maquina_seca' ? null : conductorFinal,
    });

    if (marcarComoAlquilado) {
      await this.vehiculoRepository.update(data.vehiculoId || prev.vehiculoId, { estado: 'alquilado' });
    }

    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.alquilerRepository.delete(id);
  }

  async terminar(id: number, data: AlquilerTerminarDto): Promise<AlquilerResultDto> {
    const prev = await this.findOne(id);

    if (prev.estado === 'finalizado') {
      throw new BadRequestException('El alquiler ya se encuentra finalizado.');
    }

    const kmInicial = Number(prev.kilometrajeInicial);
    const kmFinal = Number(data.kilometrajeFinal);
    if (Number.isFinite(kmInicial) && Number.isFinite(kmFinal) && kmFinal < kmInicial) {
      throw new BadRequestException('El kilometraje final no puede ser menor al kilometraje inicial.');
    }

    await this.alquilerRepository.update(id, {
      fechaFin: data.fechaFin,
      kilometrajeFinal: data.kilometrajeFinal,
      montoTotalFinal: data.montoTotalFinal,
      observaciones: data.observaciones || prev.observaciones || null,
      estado: 'finalizado',
    });

    await this.vehiculoRepository.update(prev.vehiculoId, {
      estado: 'disponible',
      kilometraje: data.kilometrajeFinal,
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

    // 1. Validar alquileres cruzados
    const activeAlquileres = await this.alquilerRepository.findActivosByVehiculo(query.vehiculoId);

    for (const alq of activeAlquileres) {
      if (alquilerId && alq.id === alquilerId) continue;

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
