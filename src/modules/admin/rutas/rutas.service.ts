import { Injectable, NotFoundException } from '@nestjs/common';
import { RutaRepository } from '@repository/ruta.repository';
import { RutaParadaRepository } from '@repository/ruta-parada.repository';
import { RutaCreateDto } from './dto/ruta/ruta-create.dto';
import { RutaUpdateDto } from './dto/ruta/ruta-update.dto';
import { PaginatedRutaResultDto } from './dto/ruta/ruta-paginated.dto';
import { RutaParadaCreateDto } from './dto/ruta-parada/ruta-parada-create.dto';

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

    if (data.paradas && data.paradas.length > 0) {
      const paradasToCreate = data.paradas.map((p, index) => ({
        ...p,
        rutaId: nuevaRuta.id,
        orden: p.orden ?? index,
      }));

      await Promise.all(paradasToCreate.map((p) => this.rutaParadaRepository.create(p)));
    } else {
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
    }

    return nuevaRuta;
  }

  async update(id: number, data: RutaUpdateDto) {
    const updatedRuta = await this.rutaRepository.update(id, data);

    if (data.paradas) {
      const existingParadas = await this.rutaParadaRepository.findByRutaId(id);

      const normalize = (p: RutaParadaCreateDto) =>
        JSON.stringify({
          n: p.nombre,
          lat: Number(p.ubicacionLat).toFixed(6),
          lng: Number(p.ubicacionLng).toFixed(6),
          d: p.distanciaPreviaParada ? Number(p.distanciaPreviaParada).toFixed(2) : null,
        });

      const existingMapped = existingParadas.sort((a, b) => a.orden - b.orden).map(normalize);
      const incomingMapped = data.paradas.map(normalize);

      const hasChanges = existingMapped.length !== incomingMapped.length || existingMapped.some((val, index) => val !== incomingMapped[index]);

      if (hasChanges) {
        // Soft Delete ALL existing
        await Promise.all(existingParadas.map((p) => this.rutaParadaRepository.delete(p.id)));

        // Create ALL new
        await Promise.all(
          data.paradas.map((p, index) => {
            // Excluir ID para crear nuevos registros
            const { id: _id, ...rest } = p;
            return this.rutaParadaRepository.create({
              ...rest,
              rutaId: id,
              orden: index,
            });
          }),
        );
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
}
