import { Injectable } from '@nestjs/common';
import { eq, or, like, and, gte, lte, count, sql, ilike, desc, isNull, inArray } from 'drizzle-orm';
import { database } from '@db/connection.db';
import { conductores, ConductorDTO } from '@db/tables/conductor.table';
import { conductorDocumentos, ConductorDocumento } from '@db/tables/conductor-documento.table';
import { FiltroDocumentoEstado } from '../modules/admin/conductores/dto/conductor/conductor-documentos-estado.dto';

interface PaginationFilters {
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  claseLicencia?: string;
  categoriaLicencia?: string;
}

@Injectable()
export class ConductorRepository {
  async findAll() {
    return await database.select().from(conductores);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters?: PaginationFilters) {
    const offset = (page - 1) * limit;
    const conditions = [];

    if (filters?.search) {
      const searchTerm = filters.search.trim();
      conditions.push(
        or(
          ilike(conductores.nombreCompleto, `%${searchTerm}%`),
          like(conductores.dni, `%${searchTerm}%`),
          like(conductores.numeroLicencia, `%${searchTerm}%`),
          ilike(conductores.email, `%${searchTerm}%`),
          like(conductores.celular, `%${searchTerm}%`),
        ),
      );
    }

    if (filters?.claseLicencia) {
      conditions.push(eq(sql`${conductores.claseLicencia}::text`, filters.claseLicencia));
    }

    if (filters?.categoriaLicencia) {
      conditions.push(eq(sql`${conductores.categoriaLicencia}::text`, filters.categoriaLicencia));
    }

    if (filters?.fechaInicio && filters?.fechaFin) {
      conditions.push(gte(conductores.creadoEn, new Date(filters.fechaInicio)));
      conditions.push(lte(conductores.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    } else if (filters?.fechaInicio) {
      conditions.push(gte(conductores.creadoEn, new Date(filters.fechaInicio)));
    } else if (filters?.fechaFin) {
      conditions.push(lte(conductores.creadoEn, new Date(filters.fechaFin + 'T23:59:59')));
    }

    // Excluir eliminados
    conditions.push(isNull(conductores.eliminadoEn));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ total }] = await database.select({ total: count() }).from(conductores).where(whereClause);

    const data = await database.select().from(conductores).where(whereClause).orderBy(desc(conductores.creadoEn)).limit(limit).offset(offset);

    return {
      data,
      total: Number(total),
    };
  }

  async findOne(id: number) {
    const result = await database
      .select()
      .from(conductores)
      .where(and(eq(conductores.id, id), isNull(conductores.eliminadoEn)));
    return result[0];
  }

  async findByEmail(email: string) {
    const result = await database
      .select()
      .from(conductores)
      .where(and(eq(conductores.email, email), isNull(conductores.eliminadoEn)));
    return result[0];
  }

  async create(data: ConductorDTO) {
    const result = await database.insert(conductores).values(data).returning();
    return result[0];
  }

  async update(id: number, data: Partial<ConductorDTO>) {
    const result = await database
      .update(conductores)
      .set({ ...data, actualizadoEn: new Date() })
      .where(eq(conductores.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    const result = await database.update(conductores).set({ eliminadoEn: new Date() }).where(eq(conductores.id, id)).returning();
    return result[0];
  }

  async findAllWithDocumentos(
    page: number = 1,
    limit: number = 10,
    filtro: FiltroDocumentoEstado = FiltroDocumentoEstado.INCOMPLETO,
  ) {
    const offset = (page - 1) * limit;

    const whereClause = isNull(conductores.eliminadoEn);

    const [{ total }] = await database
      .select({ total: count() })
      .from(conductores)
      .where(whereClause);

    const conductoresConConteo = await database
      .select({
        id: conductores.id,
        cantidadDocumentos: count(conductorDocumentos.id),
      })
      .from(conductores)
      .leftJoin(conductorDocumentos, eq(conductores.id, conductorDocumentos.conductorId))
      .where(whereClause)
      .groupBy(conductores.id);

    const tiposDocumentosEsperados = 18;

    const conductoresOrdenados = conductoresConConteo.map((v) => ({
      id: v.id,
      documentosNulos: tiposDocumentosEsperados - Number(v.cantidadDocumentos),
    }));

    if (filtro === "completo") {
      conductoresOrdenados.sort((a, b) => a.documentosNulos - b.documentosNulos);
    } else if (filtro === "incompleto") {
      conductoresOrdenados.sort((a, b) => b.documentosNulos - a.documentosNulos);
    }

    const conductoresPaginados = conductoresOrdenados.slice(offset, offset + limit);
    const ids = conductoresPaginados.map((v) => v.id);

    if (ids.length === 0) {
      return {
        conductores: [],
        documentosPorConductor: {},
        total: Number(total),
      };
    }

    const documentos = await database
      .select()
      .from(conductorDocumentos)
      .where(inArray(conductorDocumentos.conductorId, ids));

    const documentosPorConductor: Record<number, ConductorDocumento[]> = {};
    for (const doc of documentos) {
      if (!documentosPorConductor[doc.conductorId]) {
        documentosPorConductor[doc.conductorId] = [];
      }
      documentosPorConductor[doc.conductorId].push(doc);
    }

    const conductoresData = ids.length > 0
      ? await database
          .select({
            id: conductores.id,
            nombres: conductores.nombres,
            apellidos: conductores.apellidos,
            fotocheck: conductores.fotocheck,
          })
          .from(conductores)
          .where(inArray(conductores.id, ids))
      : [];

    const conductoresMap = new Map(conductoresData.map((c) => [c.id, c]));
    const conductoresOrdenadosFinal = ids.map((id) => conductoresMap.get(id)!).filter(Boolean);

    return {
      conductores: conductoresOrdenadosFinal,
      documentosPorConductor,
      total: Number(total),
    };
  }
}
