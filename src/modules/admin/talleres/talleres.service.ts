import { Injectable, NotFoundException } from '@nestjs/common';
import { TallerRepository } from '@repository/taller.repository';
import { TallerCreateDto } from './dto/taller/taller-create.dto';
import { TallerUpdateDto } from './dto/taller/taller-update.dto';

@Injectable()
export class TalleresService {
  constructor(private readonly tallerRepository: TallerRepository) {}

  async create(createTallerDto: TallerCreateDto) {
    return await this.tallerRepository.create(createTallerDto);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, search?: string, fechaInicio?: string, fechaFin?: string, tipo?: string) {
    const { data, total } = await this.tallerRepository.findAllPaginated(page, limit, { search, fechaInicio, fechaFin, tipo });

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
    const taller = await this.tallerRepository.findOne(id);
    if (!taller) {
      throw new NotFoundException(`Taller con ID ${id} no encontrado`);
    }
    return taller;
  }

  async update(id: number, updateTallerDto: TallerUpdateDto) {
    await this.findOne(id);
    return await this.tallerRepository.update(id, updateTallerDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.tallerRepository.delete(id);
  }
}
