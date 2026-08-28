import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    if (dto.viajeTramoId != null) await this.ensureTramoExists(dto.viajeTramoId);
    this.ensureStandaloneData(dto);

    const abastecimiento = await this.abastecimientoRepository.create({
      vehiculoId: dto.vehiculoId,
      viajeTramoId: dto.viajeTramoId ?? null,
      kilometrajeSuelto: dto.kilometrajeSuelto != null ? dto.kilometrajeSuelto.toString() : null,
      tramoSuelto: dto.tramoSuelto?.trim() || null,
      fechaAbastecimiento: dto.fechaAbastecimiento ? new Date(dto.fechaAbastecimiento) : null,
      metadata: dto.metadata ?? null,
      combustible: dto.combustible,
      galonesEstablecidos: dto.galonesEstablecidos.toString(),
    });

    return await this.findOne(abastecimiento.id);
  }

  async update(id: number, dto: AbastecimientoUpdateDto) {
    const current = await this.findOne(id);

    if (dto.vehiculoId != null) await this.ensureVehiculoExists(dto.vehiculoId);
    if (dto.viajeTramoId != null) await this.ensureTramoExists(dto.viajeTramoId);

    this.ensureStandaloneData({
      viajeTramoId: dto.viajeTramoId !== undefined ? dto.viajeTramoId : current.viajeTramoId,
      kilometrajeSuelto: dto.kilometrajeSuelto !== undefined ? dto.kilometrajeSuelto : current.kilometrajeSuelto,
      tramoSuelto: dto.tramoSuelto !== undefined ? dto.tramoSuelto : current.tramoSuelto,
      fechaAbastecimiento: dto.fechaAbastecimiento !== undefined ? dto.fechaAbastecimiento : current.fechaAbastecimiento,
    });

    const data: Partial<VehiculoAbastecimientoDTO> = {
      ...(dto.vehiculoId != null ? { vehiculoId: dto.vehiculoId } : {}),
      ...(dto.viajeTramoId !== undefined ? { viajeTramoId: dto.viajeTramoId } : {}),
      ...(dto.kilometrajeSuelto !== undefined ? { kilometrajeSuelto: dto.kilometrajeSuelto != null ? dto.kilometrajeSuelto.toString() : null } : {}),
      ...(dto.tramoSuelto !== undefined ? { tramoSuelto: dto.tramoSuelto?.trim() || null } : {}),
      ...(dto.fechaAbastecimiento !== undefined
        ? {
            fechaAbastecimiento: dto.fechaAbastecimiento
              ? new Date(dto.fechaAbastecimiento)
              : null,
          }
        : {}),
      ...(dto.metadata !== undefined ? { metadata: dto.metadata } : {}),
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

  private ensureStandaloneData(data: {
    viajeTramoId?: number | null;
    kilometrajeSuelto?: number | string | null;
    tramoSuelto?: string | null;
    fechaAbastecimiento?: string | Date | null;
  }) {
    if (data.viajeTramoId != null) return;

    const missingFields: string[] = [];
    if (data.kilometrajeSuelto == null) missingFields.push('kilometrajeSuelto');
    if (!data.tramoSuelto?.trim()) missingFields.push('tramoSuelto');
    if (!data.fechaAbastecimiento) missingFields.push('fechaAbastecimiento');

    if (missingFields.length > 0) {
      throw new BadRequestException(`Los abastecimientos sin viaje requieren: ${missingFields.join(', ')}`);
    }
  }
}
