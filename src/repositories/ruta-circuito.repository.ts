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
        let rutaIda = null;
        if (circuito.rutaIdaId) {
          [rutaIda] = await database
            .select()
            .from(rutas)
            .where(and(eq(rutas.id, circuito.rutaIdaId), isNull(rutas.eliminadoEn)));
        }

        let rutaVuelta = null;
        if (circuito.rutaVueltaId) {
          [rutaVuelta] = await database
            .select()
            .from(rutas)
            .where(and(eq(rutas.id, circuito.rutaVueltaId), isNull(rutas.eliminadoEn)));
        }

        return {
          id: circuito.id,
          nombre: circuito.nombre,
          rutaIda: rutaIda || null,
          rutaVuelta: rutaVuelta || null,
          esIgual: circuito.esIgual,
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

    let rutaIda = null;
    if (circuito.rutaIdaId) {
      [rutaIda] = await database
        .select()
        .from(rutas)
        .where(and(eq(rutas.id, circuito.rutaIdaId), isNull(rutas.eliminadoEn)));
    }

    let rutaVuelta = null;
    if (circuito.rutaVueltaId) {
      [rutaVuelta] = await database
        .select()
        .from(rutas)
        .where(and(eq(rutas.id, circuito.rutaVueltaId), isNull(rutas.eliminadoEn)));
    }

    return {
      id: circuito.id,
      nombre: circuito.nombre,
      rutaIda: rutaIda || null,
      rutaVuelta: rutaVuelta || null,
      esIgual: circuito.esIgual,
      creadoEn: circuito.creadoEn,
      actualizadoEn: circuito.actualizadoEn,
    };
  }

  async create(data: RutaCircuitoDTO) {
    // Es igual solo si AMBAS rutas existen y son el mismo ID
    const esIgual = data.rutaIdaId && data.rutaVueltaId ? data.rutaIdaId === data.rutaVueltaId : false;
    const result = await database
      .insert(rutaCircuitos)
      .values({ ...data, esIgual })
      .returning();
    return result[0];
  }

  async update(id: number, data: Partial<RutaCircuitoDTO>) {
    let updateData: any = { ...data };

    if (data.rutaIdaId !== undefined || data.rutaVueltaId !== undefined) {
      const [current] = await database.select().from(rutaCircuitos).where(eq(rutaCircuitos.id, id));
      if (current) {
        const ida = data.rutaIdaId ?? current.rutaIdaId;
        const vuelta = data.rutaVueltaId ?? current.rutaVueltaId;
        updateData.esIgual = ida === vuelta;
      }
    }

    const result = await database
      .update(rutaCircuitos)
      .set({ ...updateData, actualizadoEn: new Date() })
      .where(eq(rutaCircuitos.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(rutaCircuitos).set({ eliminadoEn: new Date() }).where(eq(rutaCircuitos.id, id)).returning();
    return result[0];
  }
}
