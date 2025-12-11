import { Injectable } from "@nestjs/common";
import { database } from "@db/connection.db";
import { usuarios, Usuario, UsuarioDTO } from "@model/tables/usuario.model";
import { eq, or, like, and, gte, lte, count } from "drizzle-orm";

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class UsuarioRepository {
  async findAll() {
    return await database.select().from(usuarios);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: PaginationFilters,
  ) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          like(usuarios.nombre, searchTerm),
          like(usuarios.apellido, searchTerm),
          like(usuarios.email, searchTerm),
        ),
      );
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(
        and(
          gte(usuarios.creadoEn, new Date(filters.fechaInicio)),
          lte(usuarios.creadoEn, new Date(filters.fechaFin + "T23:59:59")),
        ),
      );
    } else if (filters?.fechaInicio) {
      conditions.push(gte(usuarios.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(usuarios.creadoEn, new Date(filters.fechaFin + "T23:59:59")));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database
      .select({ total: count() })
      .from(usuarios)
      .where(whereClause);

    const data = await database
      .select()
      .from(usuarios)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database.select().from(usuarios).where(eq(usuarios.id, id));
    return result[0];
  }

  async findByEmail(email: string) {
    const result = await database
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email));
    return result[0];
  }

  async create(data: UsuarioDTO) {
    const result = await database.insert(usuarios).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<UsuarioDTO>) {
    const result = await database
      .update(usuarios)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(usuarios.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .delete(usuarios)
      .where(eq(usuarios.id, id))
      .returning();
    return result[0];
  }
}
