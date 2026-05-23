import { Injectable, NotFoundException } from '@nestjs/common';
import { VehiculoAbastecimientoRepository } from '@repository/vehiculo-abastecimiento.repository';
import { VehiculoRepository } from '@repository/vehiculo.repository';
import { ViajeTramoRepository } from '@repository/viaje-tramo.repository';
import { AbastecimientoCreateDto } from './dto/abastecimiento-create.dto';
import { AbastecimientoUpdateDto } from './dto/abastecimiento-update.dto';
import { PaginatedAbastecimientoResultDto } from './dto/abastecimiento-pagination.dto';
import { VehiculoAbastecimientoDTO } from '@db/tables/vehiculo-abastecimiento.table';

@Injectable()
export class AbastecimientosService {
  constructor(
    private readonly abastecimientoRepository: VehiculoAbastecimientoRepository,
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly viajeTramoRepository: ViajeTramoRepository,
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    vehiculoId?: number,
    viajeTramoId?: number,
  ): Promise<PaginatedAbastecimientoResultDto> {
    const { data, total } = await this.abastecimientoRepository.findAllPaginated(page, limit, {
      search,
      vehiculoId,
      viajeTramoId,
    });

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

  async findOne(id: number) {
    const abastecimiento = await this.abastecimientoRepository.findOne(id);
    if (!abastecimiento) throw new NotFoundException('Abastecimiento no encontrado');
    return abastecimiento;
  }

  async findByVehiculoId(vehiculoId: number) {
    await this.ensureVehiculoExists(vehiculoId);
    return await this.abastecimientoRepository.findByVehiculoId(vehiculoId);
  }

  async findByViajeTramo(viajeTramoId: number) {
    await this.ensureTramoExists(viajeTramoId);
    return await this.abastecimientoRepository.findByViajeTramo(viajeTramoId);
  }

  async create(dto: AbastecimientoCreateDto) {
    await this.ensureVehiculoExists(dto.vehiculoId);
    if (dto.viajeTramoId) await this.ensureTramoExists(dto.viajeTramoId);

    const abastecimiento = await this.abastecimientoRepository.create({
      vehiculoId: dto.vehiculoId,
      viajeTramoId: dto.viajeTramoId ?? null,
      combustible: dto.combustible,
      galonesEstablecidos: dto.galonesEstablecidos.toString(),
    });

    return await this.findOne(abastecimiento.id);
  }

  async update(id: number, dto: AbastecimientoUpdateDto) {
    await this.findOne(id);

    if (dto.vehiculoId) await this.ensureVehiculoExists(dto.vehiculoId);
    if (dto.viajeTramoId) await this.ensureTramoExists(dto.viajeTramoId);

    const data: Partial<VehiculoAbastecimientoDTO> = {
      ...(dto.vehiculoId ? { vehiculoId: dto.vehiculoId } : {}),
      ...(dto.viajeTramoId !== undefined ? { viajeTramoId: dto.viajeTramoId } : {}),
      ...(dto.combustible ? { combustible: dto.combustible } : {}),
      ...(dto.galonesEstablecidos !== undefined ? { galonesEstablecidos: dto.galonesEstablecidos.toString() } : {}),
    };

    await this.abastecimientoRepository.update(id, data);
    return await this.findOne(id);
  }

  async delete(id: number) {
    await this.findOne(id);
    const abastecimiento = await this.abastecimientoRepository.delete(id);
    return abastecimiento;
  }

  private async ensureVehiculoExists(vehiculoId: number) {
    const vehiculo = await this.vehiculoRepository.findOne(vehiculoId);
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
  }

  private async ensureTramoExists(viajeTramoId: number) {
    const tramo = await this.viajeTramoRepository.findOne(viajeTramoId);
    if (!tramo) throw new NotFoundException('Tramo no encontrado');
  }
}
