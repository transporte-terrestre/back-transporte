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

@Injectable()
export class AlquileresService {
  constructor(
    private readonly alquilerRepository: AlquilerRepository,
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly alquilerDocumentoRepository: AlquilerDocumentoRepository,
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

  async create(data: AlquilerCreateDto): Promise<void> {
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
    await this.alquilerRepository.create(payload);

    if (marcarComoAlquilado) {
      await this.vehiculoRepository.update(rest.vehiculoId, { estado: 'alquilado' });
    }
  }

  async update(id: number, data: AlquilerUpdateDto): Promise<void> {
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
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.alquilerRepository.delete(id);
  }

  async terminar(id: number, data: AlquilerTerminarDto): Promise<void> {
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
}
