import { Injectable } from '@nestjs/common';
import { eq, and, ilike, isNull, count, desc, gte, lte } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { rutaCircuitos, RutaCircuitoDTO } from '@db/tables/ruta-circuito.table';
import { rutas } from '@db/tables/ruta.table';

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class RutaCircuitoRepository {
  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions: any[] = [isNull(rutaCircuitos.eliminadoEn)];

    if (filters?.search) {
      conditions.push(ilike(rutaCircuitos.nombre, `%${filters.search.trim()}%`));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(rutaCircuitos.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(rutaCircuitos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(rutaCircuitos.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(rutaCircuitos.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    const whereClause = and(...conditions);

    // Total count
    const [{ total }] = await database.select({ total: count() }).from(rutaCircuitos).where(whereClause);

    // Paginated data
    const rows = await database.select().from(rutaCircuitos).where(whereClause).orderBy(desc(rutaCircuitos.creadoEn)).limit(limit).offset(offset);

    // Para cada circuito, buscar sus rutas
    const data = await Promise.all(
      rows.map(async (circuito) => {
        const [rutaIda] = await database
          .select()
          .from(rutas)
          .where(and(eq(rutas.id, circuito.rutaIdaId), isNull(rutas.eliminadoEn)));

        const [rutaVuelta] = await database
          .select()
          .from(rutas)
          .where(and(eq(rutas.id, circuito.rutaVueltaId), isNull(rutas.eliminadoEn)));

        return {
          id: circuito.id,
          nombre: circuito.nombre,
          rutaIda: rutaIda || null,
          rutaVuelta: rutaVuelta || null,
          creadoEn: circuito.creadoEn,
          actualizadoEn: circuito.actualizadoEn,
        };
      }),
    );

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(rutaCircuitos)
      .where(and(eq(rutaCircuitos.id, id), isNull(rutaCircuitos.eliminadoEn)));

    if (!result[0]) return null;

    const circuito = result[0];

    const [rutaIda] = await database
      .select()
      .from(rutas)
      .where(and(eq(rutas.id, circuito.rutaIdaId), isNull(rutas.eliminadoEn)));

    const [rutaVuelta] = await database
      .select()
      .from(rutas)
      .where(and(eq(rutas.id, circuito.rutaVueltaId), isNull(rutas.eliminadoEn)));

    return {
      id: circuito.id,
      nombre: circuito.nombre,
      rutaIda: rutaIda || null,
      rutaVuelta: rutaVuelta || null,
      creadoEn: circuito.creadoEn,
      actualizadoEn: circuito.actualizadoEn,
    };
  }

  async create(data: RutaCircuitoDTO) {
    const result = await database.insert(rutaCircuitos).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<RutaCircuitoDTO>) {
    const result = await database
      .update(rutaCircuitos)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(rutaCircuitos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(rutaCircuitos).set({ eliminadoEn: new Date() }).where(eq(rutaCircuitos.id, id)).returning();
    return result[0];
  }
}
