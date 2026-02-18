import { Injectable, NotFoundException } from '@nestjs/common';
import { RutaRepository } from '@repository/ruta.repository';
import { RutaParadaRepository } from '@repository/ruta-parada.repository';
import { RutaCircuitoRepository } from '@repository/ruta-circuito.repository';
import { PaginatedRutaResultDto } from './dto/ruta/ruta-paginated.dto';
import { RutaCreateDto } from './dto/ruta/ruta-create.dto';
import { RutaUpdateDto } from './dto/ruta/ruta-update.dto';
import { RutaCircuitoCreateDto, RutaCircuitoDetalleDto } from './dto/ruta-circuito/ruta-circuito-create.dto';
import { RutaCircuitoUpdateDto } from './dto/ruta-circuito/ruta-circuito-update.dto';

@Injectable()
export class RutasService {
  constructor(
    private readonly rutaRepository: RutaRepository,
    private readonly rutaParadaRepository: RutaParadaRepository,
    private readonly rutaCircuitoRepository: RutaCircuitoRepository,
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

  async create(data: RutaCreateDto) {
    return null;
  }

  async update(id: number, data: RutaUpdateDto) {
    return null;
  }

  async delete(id: number) {
    return this.rutaRepository.delete(id);
  }

  async findParadas(rutaId: number, search?: string) {
    if (search) {
      return await this.rutaParadaRepository.search(rutaId, search);
    }
    return await this.rutaParadaRepository.findByRutaId(rutaId);
  }

  async findAllCircuitosPaginated(page: number = 1, limit: number = 10, search?: string, fechaInicio?: string, fechaFin?: string) {
    const { data, total } = await this.rutaCircuitoRepository.findAllPaginated(page, limit, {
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

  async findOneCircuito(id: number) {
    const circuito = await this.rutaCircuitoRepository.findOne(id);
    if (!circuito) {
      throw new NotFoundException(`Circuito con ID ${id} no encontrado`);
    }

    const result = {
      ...circuito,
      rutaIda: circuito.rutaIda ? { ...circuito.rutaIda, paradas: [] } : null,
      rutaVuelta: circuito.rutaVuelta ? { ...circuito.rutaVuelta, paradas: [] } : null,
    };

    if (result.rutaIda) {
      const paradas = await this.rutaParadaRepository.findByRutaId(result.rutaIda.id);
      result.rutaIda.paradas = paradas;
    }

    if (result.rutaVuelta) {
      const paradas = await this.rutaParadaRepository.findByRutaId(result.rutaVuelta.id);
      result.rutaVuelta.paradas = paradas;
    }

    return result;
  }

  async createCircuito(data: RutaCircuitoCreateDto) {
    let rutaIda = null;
    let rutaVuelta = null;

    if (data.ida) {
      rutaIda = await this.crearRutaConParadas(data.ida);
    }

    if (data.vuelta) {
      rutaVuelta = await this.crearRutaConParadas(data.vuelta);
    }

    const circuito = await this.rutaCircuitoRepository.create({
      nombre: data.nombre,
      esIgual: data.esIgual ?? false,
      rutaIdaId: rutaIda?.id || null,
      rutaVueltaId: rutaVuelta?.id || null,
    });

    return this.findOneCircuito(circuito.id);
  }

  async updateCircuito(id: number, data: RutaCircuitoUpdateDto) {
    const circuitoExistente = await this.findOneCircuito(id);

    const normalizeRuta = (ruta: typeof circuitoExistente.rutaIda) => {
      if (!ruta) return null;
      return {
        origen: ruta.origen,
        destino: ruta.destino,
        origenLat: Number(ruta.origenLat).toFixed(6),
        origenLng: Number(ruta.origenLng).toFixed(6),
        destinoLat: Number(ruta.destinoLat).toFixed(6),
        destinoLng: Number(ruta.destinoLng).toFixed(6),
        distancia: Number(ruta.distancia).toFixed(2),
        costoBase: Number(ruta.costoBase).toFixed(2),
        paradas:
          ruta.paradas
            ?.sort((a, b) => a.orden - b.orden)
            .map((p) => ({
              nombre: p.nombre,
              ubicacionLat: Number(p.ubicacionLat).toFixed(6),
              ubicacionLng: Number(p.ubicacionLng).toFixed(6),
              orden: p.orden,
            })) || [],
      };
    };

    const normalizeDto = (dto: RutaCircuitoDetalleDto) => {
      if (!dto) return null;
      return {
        origen: dto.origen,
        destino: dto.destino,
        origenLat: Number(dto.origenLat).toFixed(6),
        origenLng: Number(dto.origenLng).toFixed(6),
        destinoLat: Number(dto.destinoLat).toFixed(6),
        destinoLng: Number(dto.destinoLng).toFixed(6),
        distancia: Number(dto.distancia).toFixed(2),
        costoBase: Number(dto.costoBase).toFixed(2),
        paradas:
          dto.paradas
            ?.map((p, index) => ({
              nombre: p.nombre,
              ubicacionLat: Number(p.ubicacionLat).toFixed(6),
              ubicacionLng: Number(p.ubicacionLng).toFixed(6),
              orden: p.orden ?? index,
            }))
            .sort((a, b) => a.orden - b.orden) || [],
      };
    };

    const currentIdaState = normalizeRuta(circuitoExistente.rutaIda);
    const currentVueltaState = normalizeRuta(circuitoExistente.rutaVuelta);

    const newIdaState = normalizeDto(data.ida);
    const newVueltaState = normalizeDto(data.vuelta);

    const isIdaChanged = JSON.stringify(currentIdaState) !== JSON.stringify(newIdaState);
    const isVueltaChanged = JSON.stringify(currentVueltaState) !== JSON.stringify(newVueltaState);
    const isNombreChanged = circuitoExistente.nombre !== data.nombre;

    const isEsIgualChanged = data.esIgual !== undefined && circuitoExistente.esIgual !== data.esIgual;

    if (isIdaChanged || isVueltaChanged) {
      if (circuitoExistente.rutaIda) await this.rutaRepository.delete(circuitoExistente.rutaIda.id);
      if (circuitoExistente.rutaVuelta) await this.rutaRepository.delete(circuitoExistente.rutaVuelta.id);

      let newRutaIda = null;
      let newRutaVuelta = null;

      if (data.ida) newRutaIda = await this.crearRutaConParadas(data.ida);
      if (data.vuelta) newRutaVuelta = await this.crearRutaConParadas(data.vuelta);

      await this.rutaCircuitoRepository.update(id, {
        nombre: data.nombre ?? circuitoExistente.nombre,
        esIgual: data.esIgual ?? circuitoExistente.esIgual,
        rutaIdaId: newRutaIda?.id || null,
        rutaVueltaId: newRutaVuelta?.id || null,
      });
    } else if (isNombreChanged || isEsIgualChanged) {
      const updates: any = {};
      if (isNombreChanged) updates.nombre = data.nombre;
      if (isEsIgualChanged) updates.esIgual = data.esIgual;
      await this.rutaCircuitoRepository.update(id, updates);
    }

    return this.findOneCircuito(id);
  }

  async deleteCircuito(id: number) {
    const circuito = await this.findOneCircuito(id);

    await this.rutaCircuitoRepository.delete(id);

    if (circuito.rutaIda) await this.rutaRepository.delete(circuito.rutaIda.id);
    if (circuito.rutaVuelta) await this.rutaRepository.delete(circuito.rutaVuelta.id);

    return { message: 'Circuito y rutas asociadas eliminados correctamente' };
  }

  private async crearRutaConParadas(data: RutaCircuitoDetalleDto) {
    const nuevaRuta = await this.rutaRepository.create({
      origen: data.origen,
      destino: data.destino,
      origenLat: data.origenLat,
      origenLng: data.origenLng,
      destinoLat: data.destinoLat,
      destinoLng: data.destinoLng,
      distancia: data.distancia.toString(),
      costoBase: data.costoBase.toString(),
    });

    if (data.paradas && data.paradas.length > 0) {
      const paradasToCreate = data.paradas.map((p, index) => ({
        rutaId: nuevaRuta.id,
        nombre: p.nombre,
        ubicacionLat: p.ubicacionLat,
        ubicacionLng: p.ubicacionLng,
        orden: p.orden ?? index,
        distanciaPreviaParada: p.distanciaPreviaParada,
      }));

      await this.rutaParadaRepository.createMany(paradasToCreate);
    } else {
      if (!data.paradas) {
        await this.rutaParadaRepository.createMany([
          { rutaId: nuevaRuta.id, nombre: nuevaRuta.origen, orden: 0, ubicacionLat: nuevaRuta.origenLat, ubicacionLng: nuevaRuta.origenLng },
          { rutaId: nuevaRuta.id, nombre: nuevaRuta.destino, orden: 1, ubicacionLat: nuevaRuta.destinoLat, ubicacionLng: nuevaRuta.destinoLng },
        ]);
      }
    }

    return nuevaRuta;
  }
}
