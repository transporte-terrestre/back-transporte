import { Injectable, NotFoundException } from '@nestjs/common';
import { TallerRepository } from '@repository/taller.repository';
import { SucursalRepository } from '@repository/sucursal.repository';
import { TallerCreateDto } from './dto/taller/taller-create.dto';
import { TallerUpdateDto } from './dto/taller/taller-update.dto';
import { SucursalCreateDto } from './dto/sucursal/sucursal-create.dto';
import { SucursalUpdateDto } from './dto/sucursal/sucursal-update.dto';

@Injectable()
export class TalleresService {
  constructor(
    private readonly tallerRepository: TallerRepository,
    private readonly sucursalRepository: SucursalRepository,
  ) {}

  // --- MÉTODOS PARA TALLERES ---
  async create(createTallerDto: TallerCreateDto) {
    const { sucursales, ...tallerData } = createTallerDto;
    const taller = await this.tallerRepository.create(tallerData);

    if (sucursales && sucursales.length > 0) {
      const sucursalesData = sucursales.map((s) => ({
        ...s,
        tallerId: taller.id,
      }));
      await this.sucursalRepository.createMany(sucursalesData);
    }

    return taller;
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
    const sucursalesList = await this.sucursalRepository.findByTaller(id);
    return { ...taller, sucursalIds: sucursalesList.map((s) => s.id), sucursales: sucursalesList };
  }

  async update(id: number, updateTallerDto: TallerUpdateDto) {
    await this.findOne(id);
    const { sucursales, ...tallerData } = updateTallerDto;

    const updated = await this.tallerRepository.update(id, tallerData);

    if (sucursales !== undefined) {
      // Reemplazar sucursales (lógica similar a pasajeros/entidades)
      await this.sucursalRepository.hardDeleteByTaller(id);
      if (sucursales.length > 0) {
        const sucursalesData = sucursales.map((s) => ({
          ...s,
          tallerId: id,
        }));
        await this.sucursalRepository.createMany(sucursalesData);
      }
    }

    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.tallerRepository.delete(id);
  }

  // --- MÉTODOS PARA SUCURSALES ---
  async createSucursal(createSucursalDto: SucursalCreateDto) {
    return await this.sucursalRepository.create(createSucursalDto);
  }

  async findAllSucursalesPaginated(page: number = 1, limit: number = 10, search?: string, fechaInicio?: string, fechaFin?: string) {
    const { data, total } = await this.sucursalRepository.findAllPaginated(page, limit, { search, fechaInicio, fechaFin });
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async findAllSucursales() {
    return await this.sucursalRepository.findAll();
  }

  async findOneSucursal(id: number) {
    const sucursal = await this.sucursalRepository.findOne(id);
    if (!sucursal) {
      throw new NotFoundException(`Sucursal con ID ${id} no encontrada`);
    }
    return sucursal;
  }

  async updateSucursal(id: number, updateSucursalDto: SucursalUpdateDto) {
    await this.findOneSucursal(id);
    return await this.sucursalRepository.update(id, updateSucursalDto);
  }

  async removeSucursal(id: number) {
    await this.findOneSucursal(id);
    return await this.sucursalRepository.delete(id);
  }
}
