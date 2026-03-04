import { Injectable, NotFoundException } from '@nestjs/common';
import { AlquilerRepository } from '@repository/alquiler.repository';
import { AlquilerCreateDto } from './dto/alquiler/alquiler-create.dto';
import { AlquilerUpdateDto } from './dto/alquiler/alquiler-update.dto';
import { AlquilerQueryDto, AlquilerListDto } from './dto/alquiler/alquiler-list.dto';
import { AlquilerResultDto } from './dto/alquiler/alquiler-result.dto';

@Injectable()
export class AlquileresService {
  constructor(private readonly alquilerRepository: AlquilerRepository) {}

  async findAll(query: AlquilerQueryDto): Promise<AlquilerListDto> {
    const { page = 1, limit = 10, ...filters } = query;
    const { data, total } = await this.alquilerRepository.findAllPaginated(page, limit, filters);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as any, // Cast temporario para mapear al ItemDto
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
    return alquiler as any;
  }

  async create(data: AlquilerCreateDto): Promise<void> {
    const payload = {
      ...data,
      fechaFin: data.fechaFin || null,
    };
    await this.alquilerRepository.create(payload as any);
  }

  async update(id: number, data: AlquilerUpdateDto): Promise<void> {
    const prev = await this.findOne(id);
    const payload = {
      ...data,
    };
    await this.alquilerRepository.update(id, payload as any);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.alquilerRepository.delete(id);
  }
}
