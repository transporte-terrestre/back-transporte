import { Injectable, NotFoundException } from '@nestjs/common';
import { RutaRepository } from '@repository/ruta.repository';
import { RutaParadaRepository } from '@repository/ruta-parada.repository';
import { RutaCreateDto } from './dto/ruta/ruta-create.dto';
import { RutaUpdateDto } from './dto/ruta/ruta-update.dto';
import { PaginatedRutaResultDto } from './dto/ruta/ruta-paginated.dto';
import { RutaParadaCreateDto } from './dto/ruta-parada/ruta-parada-create.dto';
import { RutaParadaUpdateDto } from './dto/ruta-parada/ruta-parada-update.dto';

@Injectable()
export class RutasService {
  constructor(
    private readonly rutaRepository: RutaRepository,
    private readonly rutaParadaRepository: RutaParadaRepository,
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<PaginatedRutaResultDto> {
    const { data, total } = await this.rutaRepository.findAllPaginated(page, limit, {
      search,
      fechaInicio,
      fechaFin,
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
    const ruta = await this.rutaRepository.findOne(id);
    if (!ruta) {
      throw new NotFoundException(`Ruta con ID ${id} no encontrada`);
    }
    const paradas = await this.rutaParadaRepository.findByRutaId(id);
    return { ...ruta, paradas };
  }

  create(data: RutaCreateDto) {
    return this.rutaRepository.create(data);
  }

  update(id: number, data: RutaUpdateDto) {
    return this.rutaRepository.update(id, data);
  }

  delete(id: number) {
    return this.rutaRepository.delete(id);
  }

  // ========== PARADAS ==========
  async findParadas(rutaId: number, search?: string) {
    if (search) {
      return await this.rutaParadaRepository.search(rutaId, search);
    }
    return await this.rutaParadaRepository.findByRutaId(rutaId);
  }

  async findParada(paradaId: number) {
    const parada = await this.rutaParadaRepository.findOne(paradaId);
    if (!parada) {
      throw new NotFoundException(`Parada con ID ${paradaId} no encontrada`);
    }
    return parada;
  }

  async createParada(rutaId: number, data: RutaParadaCreateDto) {
    // Obtener el orden máximo actual y sumar 1
    const maxOrden = await this.rutaParadaRepository.getMaxOrden(rutaId);
    return await this.rutaParadaRepository.create({
      ...data,
      rutaId,
      orden: maxOrden + 1,
    });
  }

  async updateParada(paradaId: number, data: RutaParadaUpdateDto) {
    return await this.rutaParadaRepository.update(paradaId, data);
  }

  async deleteParada(paradaId: number) {
    return await this.rutaParadaRepository.delete(paradaId);
  }

  async reordenarParadas(rutaId: number, paradas: { id: number; orden: number }[]) {
    return await this.rutaParadaRepository.reordenar(rutaId, paradas);
  }
}
