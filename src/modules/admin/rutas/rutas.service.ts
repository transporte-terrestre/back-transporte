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

  async create(data: RutaCreateDto) {
    const nuevaRuta = await this.rutaRepository.create(data);

    // Crear paradas por defecto: Origen y Destino
    await Promise.all([
      this.rutaParadaRepository.create({
        rutaId: nuevaRuta.id,
        nombre: nuevaRuta.origen,
        orden: 0,
        ubicacionLat: nuevaRuta.origenLat,
        ubicacionLng: nuevaRuta.origenLng,
      }),
      this.rutaParadaRepository.create({
        rutaId: nuevaRuta.id,
        nombre: nuevaRuta.destino,
        orden: 1,
        ubicacionLat: nuevaRuta.destinoLat,
        ubicacionLng: nuevaRuta.destinoLng,
      }),
    ]);

    return nuevaRuta;
  }

  async update(id: number, data: RutaUpdateDto) {
    const updatedRuta = await this.rutaRepository.update(id, data);

    // Sincronizar paradas extremas (Origen y Destino)
    if (updatedRuta) {
      const paradas = await this.rutaParadaRepository.findByRutaId(id);

      // Buscar parada de origen (orden 0 o la menor)
      let paradaOrigen = paradas.find((p) => p.orden === 0);
      if (!paradaOrigen && paradas.length > 0) {
        paradaOrigen = paradas.reduce((prev, curr) => (prev.orden < curr.orden ? prev : curr));
      }

      // Buscar parada de destino (la de mayor orden)
      let paradaDestino = paradas.length > 0 ? paradas.reduce((prev, curr) => (prev.orden > curr.orden ? prev : curr)) : undefined;

      // Si solo hay 1 parada, destino es undefined para crearlo
      if (paradaDestino && paradaDestino.id === paradaOrigen?.id) {
        paradaDestino = undefined;
      }

      const operaciones: Promise<any>[] = [];

      // ACTUALIZAR ORIGEN
      if (!paradaOrigen) {
        operaciones.push(
          this.rutaParadaRepository.create({
            rutaId: id,
            nombre: updatedRuta.origen,
            orden: 0,
            ubicacionLat: updatedRuta.origenLat,
            ubicacionLng: updatedRuta.origenLng,
          }),
        );
      } else {
        operaciones.push(
          this.rutaParadaRepository.update(paradaOrigen.id, {
            nombre: updatedRuta.origen,
            ubicacionLat: updatedRuta.origenLat,
            ubicacionLng: updatedRuta.origenLng,
            orden: 0,
          }),
        );
      }

      // ACTUALIZAR DESTINO
      if (!paradaDestino) {
        const nuevoOrden = paradas.length > 0 ? Math.max(...paradas.map((p) => p.orden)) + 1 : 1;
        operaciones.push(
          this.rutaParadaRepository.create({
            rutaId: id,
            nombre: updatedRuta.destino,
            orden: nuevoOrden,
            ubicacionLat: updatedRuta.destinoLat,
            ubicacionLng: updatedRuta.destinoLng,
          }),
        );
      } else {
        operaciones.push(
          this.rutaParadaRepository.update(paradaDestino.id, {
            nombre: updatedRuta.destino,
            ubicacionLat: updatedRuta.destinoLat,
            ubicacionLng: updatedRuta.destinoLng,
          }),
        );
      }

      if (operaciones.length > 0) {
        await Promise.all(operaciones);
      }
    }

    return updatedRuta;
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
    let orden = data.orden;

    if (orden === undefined) {
      const maxOrdenVal = await this.rutaParadaRepository.getMaxOrden(rutaId);
      const maxOrden = Number(maxOrdenVal ?? 0);
      orden = maxOrden + 1;
    } else {
      // Verificar colisión y desplazar si es necesario
      const paradas = await this.rutaParadaRepository.findByRutaId(rutaId);
      const collision = paradas.some((p) => p.orden === orden);
      if (collision) {
        await this.rutaParadaRepository.shiftOrders(rutaId, orden);
      }
    }

    return await this.rutaParadaRepository.create({
      ...data,
      rutaId,
      orden,
    });
  }

  async updateParada(paradaId: number, data: RutaParadaUpdateDto) {
    if (data.orden !== undefined) {
      const currentParada = await this.findParada(paradaId);
      const rutaId = currentParada.rutaId;

      const paradas = await this.rutaParadaRepository.findByRutaId(rutaId);
      const collision = paradas.some((p) => p.orden === data.orden && p.id !== paradaId);

      if (collision) {
        await this.rutaParadaRepository.shiftOrders(rutaId, data.orden);
      }
    }
    return await this.rutaParadaRepository.update(paradaId, data);
  }

  async deleteParada(paradaId: number) {
    return await this.rutaParadaRepository.delete(paradaId);
  }

  async reordenarParadas(rutaId: number, paradas: { id: number; orden: number }[]) {
    return await this.rutaParadaRepository.reordenar(rutaId, paradas);
  }
}
