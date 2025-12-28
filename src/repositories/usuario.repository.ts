import { Injectable } from "@nestjs/common";
import { database } from "@db/connection.db";
import { usuarios, Usuario, UsuarioDTO } from "@model/tables/usuario.model";
import {
  eq,
  or,
  like,
  and,
  gte,
  lte,
  count,
  sql,
  ilike,
  desc,
  isNull,
} from "drizzle-orm";

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  rol?: string;
}

@Injectable()
export class UsuarioRepository {
  async findAll() {
    return await database.select().from(usuarios);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: PaginationFilters
  ) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(
        or(
          ilike(usuarios.nombreCompleto, `%${searchTerm}%`),
          like(usuarios.email, `%${searchTerm}%`),
          like(usuarios.nombres, `%${searchTerm}%`),
          like(usuarios.apellidos, `%${searchTerm}%`)
        )
      );
    }

    if (filters?.rol) {
      conditions.push(sql`${filters.rol} = ANY(${usuarios.roles})`);
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(usuarios.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(
        lte(usuarios.creadoEn, new Date(filters.fechaFin + "T23:59:59"))
      );
    } else if (filters?.fechaInicio) {
      conditions.push(gte(usuarios.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(
        lte(usuarios.creadoEn, new Date(filters.fechaFin + "T23:59:59"))
      );
    }

    // Excluir eliminados
    conditions.push(isNull(usuarios.eliminadoEn));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database
      .select({ total: count() })
      .from(usuarios)
      .where(whereClause);

    const data = await database
      .select({
        id: usuarios.id,
        nombres: usuarios.nombres,
        apellidos: usuarios.apellidos,
        nombreCompleto: usuarios.nombreCompleto,
        email: usuarios.email,
        roles: usuarios.roles,
        fotocheck: usuarios.fotocheck,
        creadoEn: usuarios.creadoEn,
        actualizadoEn: usuarios.actualizadoEn,
        eliminadoEn: usuarios.eliminadoEn,
      })
      .from(usuarios)
      .where(whereClause)
      .orderBy(desc(usuarios.creadoEn))
      .limit(limit)
      .offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select({
        id: usuarios.id,
        nombres: usuarios.nombres,
        apellidos: usuarios.apellidos,
        nombreCompleto: usuarios.nombreCompleto,
        email: usuarios.email,
        roles: usuarios.roles,
        fotocheck: usuarios.fotocheck,
        creadoEn: usuarios.creadoEn,
        actualizadoEn: usuarios.actualizadoEn,
        eliminadoEn: usuarios.eliminadoEn,
      })
      .from(usuarios)
      .where(and(eq(usuarios.id, id), isNull(usuarios.eliminadoEn)));
    return result[0];
  }

  async findByEmail(email: string) {
    const result = await database
      .select()
      .from(usuarios)
      .where(and(eq(usuarios.email, email), isNull(usuarios.eliminadoEn)));
    return result[0];
  }

  async create(data: UsuarioDTO) {
    const result = await database.insert(usuarios).values(data).returning({
      id: usuarios.id,
      nombres: usuarios.nombres,
      apellidos: usuarios.apellidos,
      nombreCompleto: usuarios.nombreCompleto,
      email: usuarios.email,
      roles: usuarios.roles,
      fotocheck: usuarios.fotocheck,
      creadoEn: usuarios.creadoEn,
      actualizadoEn: usuarios.actualizadoEn,
    });
    return result[0];
  }

  async update(id: number, data: Partial<UsuarioDTO>) {
    const result = await database
      .update(usuarios)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(usuarios.id, id))
      .returning({
        id: usuarios.id,
        nombres: usuarios.nombres,
        apellidos: usuarios.apellidos,
        nombreCompleto: usuarios.nombreCompleto,
        email: usuarios.email,
        roles: usuarios.roles,
        fotocheck: usuarios.fotocheck,
        creadoEn: usuarios.creadoEn,
        actualizadoEn: usuarios.actualizadoEn,
      });
    return result[0];
  }

  async delete(id: number) {
    const result = await database
      .update(usuarios)
      .set({ eliminadoEn: new Date() })
      .where(eq(usuarios.id, id))
      .returning({
        id: usuarios.id,
        nombres: usuarios.nombres,
        apellidos: usuarios.apellidos,
        nombreCompleto: usuarios.nombreCompleto,
        email: usuarios.email,
        roles: usuarios.roles,
        fotocheck: usuarios.fotocheck,
        creadoEn: usuarios.creadoEn,
        actualizadoEn: usuarios.actualizadoEn,
      });
    return result[0];
  }
}
