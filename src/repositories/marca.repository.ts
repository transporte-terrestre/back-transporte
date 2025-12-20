import { Injectable } from "@nestjs/common";
import { database } from "@db/connection.db";
import { marcas, MarcaDTO } from "@model/tables/marca.model";
import { modelos } from "@model/tables/modelo.model";
import { eq, count, and, gte, lte, ilike, desc, isNull } from "drizzle-orm";

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class MarcaRepository {
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: PaginationFilters
  ) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(ilike(marcas.nombre, `%${searchTerm}%`));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(marcas.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(
        lte(marcas.creadoEn, new Date(filters.fechaFin + "T23:59:59"))
      );
    } else if (filters?.fechaInicio) {
      conditions.push(gte(marcas.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(
        lte(marcas.creadoEn, new Date(filters.fechaFin + "T23:59:59"))
      );
    }

    conditions.push(isNull(marcas.eliminadoEn));
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database
      .select({ total: count() })
      .from(marcas)
      .where(whereClause);

    const marcasData = await database
      .select()
      .from(marcas)
      .where(whereClause)
      .orderBy(desc(marcas.creadoEn))
      .limit(limit)
      .offset(offset);

    // Fetch modelos for each marca
    const data = await Promise.all(
      marcasData.map(async (marca) => {
        const modelosData = await database
          .select({ nombre: modelos.nombre })
          .from(modelos)
          .where(
            and(eq(modelos.marcaId, marca.id), isNull(modelos.eliminadoEn))
          );

        return {
          ...marca,
          modelos: modelosData.map((m) => m.nombre),
        };
      })
    );

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(marcas)
      .where(and(eq(marcas.id, id), isNull(marcas.eliminadoEn)));
    return result[0];
  }

  async create(data: MarcaDTO) {
    const result = await database.insert(marcas).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<MarcaDTO>) {
    const result = await database
      .update(marcas)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(marcas.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .update(marcas)
      .set({ eliminadoEn: new Date() })
      .where(eq(marcas.id, id))
      .returning();
    return result[0];
  }
}
