import { Injectable, Logger } from '@nestjs/common';
import { database } from '@db/connection.db';
import { auditorias, AuditoriaDTO } from '@db/tables/auditoria.table';
import { usuarios } from '@db/tables/usuario.table';
import { conductores } from '@db/tables/conductor.table';
import { eq, desc, count, and, gte, lte, or, ilike, sql } from 'drizzle-orm';

interface AuditoriaFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

@Injectable()
export class AuditoriaRepository {
  private readonly logger = new Logger(AuditoriaRepository.name);

  async insertar(auditoria: AuditoriaDTO) {
    const data = await database.insert(auditorias).values(auditoria).returning();
    return data[0];
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: AuditoriaFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(
        or(
          ilike(auditorias.modulo, `%${searchTerm}%`),
          ilike(auditorias.accion, `%${searchTerm}%`),
          ilike(usuarios.nombres, `%${searchTerm}%`),
          ilike(usuarios.apellidos, `%${searchTerm}%`),
          ilike(conductores.nombres, `%${searchTerm}%`),
          ilike(conductores.apellidos, `%${searchTerm}%`),
        ),
      );
    }

    if (filters?.fechaInicio) {
      conditions.push(gte(auditorias.fechaHora, new Date(filters.fechaInicio)));
    }

    if (filters?.fechaFin) {
      const endOfDay = new Date(filters.fechaFin);
      endOfDay.setHours(23, 59, 59, 999);
      conditions.push(lte(auditorias.fechaHora, endOfDay));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [records, totalCount] = await Promise.all([
      database
        .select({
          id: auditorias.id,
          accion: auditorias.accion,
          usuarioId: auditorias.usuarioId,
          conductorId: auditorias.conductorId,
          modulo: auditorias.modulo,
          detalle: auditorias.detalle,
          fechaHora: auditorias.fechaHora,
          executorNombre: sql<string>`COALESCE(${usuarios.nombres}, ${conductores.nombres})`,
          executorApellido: sql<string>`COALESCE(${usuarios.apellidos}, ${conductores.apellidos})`,
          executorRol: sql<string>`COALESCE(${usuarios.roles}::text, 'CONDUCTOR')`,
          executorEmail: sql<string>`COALESCE(${usuarios.email}, ${conductores.email})`,
        })
        .from(auditorias)
        .leftJoin(usuarios, eq(auditorias.usuarioId, usuarios.id))
        .leftJoin(conductores, eq(auditorias.conductorId, conductores.id))
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(auditorias.fechaHora)),
      database.select({ value: count() }).from(auditorias).where(whereClause),
    ]);

    const total = totalCount[0]?.value || 0;

    return {
      data: records,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const data = await database
      .select({
        id: auditorias.id,
        accion: auditorias.accion,
        usuarioId: auditorias.usuarioId,
        conductorId: auditorias.conductorId,
        modulo: auditorias.modulo,
        detalle: auditorias.detalle,
        fechaHora: auditorias.fechaHora,
        executorNombre: sql<string>`COALESCE(${usuarios.nombres}, ${conductores.nombres})`,
        executorApellido: sql<string>`COALESCE(${usuarios.apellidos}, ${conductores.apellidos})`,
        executorRol: sql<string>`COALESCE(${usuarios.roles}::text, 'CONDUCTOR')`,
        executorEmail: sql<string>`COALESCE(${usuarios.email}, ${conductores.email})`,
      })
      .from(auditorias)
      .leftJoin(usuarios, eq(auditorias.usuarioId, usuarios.id))
      .leftJoin(conductores, eq(auditorias.conductorId, conductores.id))
      .where(eq(auditorias.id, id))
      .limit(1);

    return data[0] || null;
  }
}
