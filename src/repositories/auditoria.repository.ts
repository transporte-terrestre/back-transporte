import { Injectable, Logger } from '@nestjs/common';
import { database } from '@db/connection.db';
import { auditorias, AuditoriaDTO } from '@db/tables/auditoria.table';
import { usuarios } from '@db/tables/usuario.table';
import { eq, desc, count, and, gte, lte, or, ilike } from 'drizzle-orm';

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
    this.logger.debug(`Insertado registro de auditoría en DB: ${auditoria.accion} - ${auditoria.modulo}`);
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
          modulo: auditorias.modulo,
          detalle: auditorias.detalle,
          fechaHora: auditorias.fechaHora,
          usuarioNombre: usuarios.nombres,
          usuarioApellido: usuarios.apellidos,
          usuarioRol: usuarios.roles,
        })
        .from(auditorias)
        .innerJoin(usuarios, eq(auditorias.usuarioId, usuarios.id))
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(auditorias.fechaHora)),
      database.select({ value: count() }).from(auditorias).innerJoin(usuarios, eq(auditorias.usuarioId, usuarios.id)).where(whereClause),
    ]);

    const total = totalCount[0]?.value || 0;

    return {
      data: records,
      total: Number(total),
    };
  }
}
