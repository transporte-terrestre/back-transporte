import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { notificaciones, NotificacionDestino, NotificacionDTO, Notificacion } from '@db/tables/notificacion.table';
import { notificacionesLeidas } from '@db/tables/notificacion-leida.table';
import { notificacionesConductorLeidas } from '@db/tables/notificacion-conductor-leida.table';
import { conductorDocumentos } from '@db/tables/conductor-documento.table';
import { vehiculoDocumentos } from '@db/tables/vehiculo-documento.table';
import { conductores } from '@db/tables/conductor.table';
import { vehiculos } from '@db/tables/vehiculo.table';
import { modelos } from '@db/tables/modelo.table';
import { marcas } from '@db/tables/marca.table';
import { usuarios } from '@db/tables/usuario.table';
import { eq, and, desc, isNull, count, sql, lte, isNotNull, gte } from 'drizzle-orm';

// Types for document expiration results
export interface DocumentoVencimientoBase {
  documentoId: number;
  tipoDocumento: string;
  nombreDocumento: string;
  fechaExpiracion: string;
  diasRestantes: number; // negative = expired, positive = days until expiration
}

export interface ConductorDocumentoVencimiento extends DocumentoVencimientoBase {
  entidad: 'conductor';
  entidadId: number;
  entidadNombre: string;
  email?: string | null;
}

export interface VehiculoDocumentoVencimiento extends DocumentoVencimientoBase {
  entidad: 'vehiculo';
  entidadId: number;
  entidadNombre: string; // placa - marca modelo
}

export type DocumentoVencimiento = ConductorDocumentoVencimiento | VehiculoDocumentoVencimiento;

@Injectable()
export class NotificacionRepository {
  // =============================================
  // EXISTING METHODS
  // =============================================

  async findAllPaginatedByUsuario(usuarioId: number, page: number = 1, limit: number = 10, destino: NotificacionDestino = 'sistema', entidad?: string, fechaInicio?: string, fechaFin?: string) {
    const offset = (page - 1) * limit;

    const conditions = [eq(notificaciones.destino, destino), isNull(notificaciones.eliminadoEn), isNull(notificacionesLeidas.ocultadoEn)];
    if (entidad) {
      conditions.push(sql`${notificaciones.metadata}->>'entidad' = ${entidad}`);
    }
    if (fechaInicio) {
      conditions.push(gte(notificaciones.creadoEn, new Date(fechaInicio)));
    }
    if (fechaFin) {
      conditions.push(lte(notificaciones.creadoEn, new Date(fechaFin)));
    }

    const query = database
      .select({
        id: notificaciones.id,
        titulo: notificaciones.titulo,
        mensaje: notificaciones.mensaje,
        tipo: notificaciones.tipo,
        metadata: notificaciones.metadata,
        creadoEn: notificaciones.creadoEn,
        leido: sql<boolean>`CASE WHEN ${notificacionesLeidas.id} IS NOT NULL THEN true ELSE false END`.as('leido'),
      })
      .from(notificaciones)
      .leftJoin(notificacionesLeidas, and(eq(notificacionesLeidas.notificacionId, notificaciones.id), eq(notificacionesLeidas.usuarioId, usuarioId)))
      .where(and(...conditions))
      .orderBy(desc(notificaciones.creadoEn))
      .limit(limit)
      .offset(offset);

    const data = await query;
    const totalResult = await database
      .select({ count: count() })
      .from(notificaciones)
      .leftJoin(notificacionesLeidas, and(eq(notificacionesLeidas.notificacionId, notificaciones.id), eq(notificacionesLeidas.usuarioId, usuarioId)))
      .where(and(...conditions));

    return { data, total: Number(totalResult[0]?.count || 0) };
  }

  async findOne(id: number) {
    const [result] = await database
      .select()
      .from(notificaciones)
      .where(and(eq(notificaciones.id, id), isNull(notificaciones.eliminadoEn)));
    return result;
  }

  async create(data: NotificacionDTO) {
    const result = await database.insert(notificaciones).values(data).returning();
    return result[0];
  }

  async createMany(data: NotificacionDTO[]) {
    if (data.length === 0) return [];
    const result = await database.insert(notificaciones).values(data).returning();
    return result;
  }

  async markAsRead(usuarioId: number, notificacionId: number) {
    const [notif] = await database
      .select()
      .from(notificaciones)
      .where(and(eq(notificaciones.id, notificacionId), isNull(notificaciones.eliminadoEn)));

    if (!notif) return null;

    const [alreadyRead] = await database
      .select()
      .from(notificacionesLeidas)
      .where(and(eq(notificacionesLeidas.usuarioId, usuarioId), eq(notificacionesLeidas.notificacionId, notificacionId)));
    if (alreadyRead) return alreadyRead;

    const result = await database
      .insert(notificacionesLeidas)
      .values({
        usuarioId,
        notificacionId,
        leidoEn: new Date(),
      })
      .returning();

    return result[0];
  }

  async dismiss(usuarioId: number, notificacionId: number) {
    const [alreadyExists] = await database
      .select()
      .from(notificacionesLeidas)
      .where(and(eq(notificacionesLeidas.usuarioId, usuarioId), eq(notificacionesLeidas.notificacionId, notificacionId)));

    if (alreadyExists) {
      const [updated] = await database
        .update(notificacionesLeidas)
        .set({ ocultadoEn: new Date() })
        .where(eq(notificacionesLeidas.id, alreadyExists.id))
        .returning();
      return updated;
    }

    const result = await database
      .insert(notificacionesLeidas)
      .values({
        usuarioId,
        notificacionId,
        ocultadoEn: new Date(),
        leidoEn: new Date(),
      })
      .returning();

    return result[0];
  }

  // =============================================
  // CONDUCTOR METHODS
  // =============================================

  async createForConductor(conductorId: number, data: NotificacionDTO) {
    return await database.transaction(async (tx) => {
      // 1. Create the notification itself
      const [notif] = await tx.insert(notificaciones).values({ ...data, destino: 'conductor' }).returning();

      // 2. Link it to the conductor
      await tx.insert(notificacionesConductorLeidas).values({
        conductorId,
        notificacionId: notif.id,
      });

      return notif;
    });
  }

  async findAllPaginatedByConductor(conductorId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const query = database
      .select({
        id: notificaciones.id,
        titulo: notificaciones.titulo,
        mensaje: notificaciones.mensaje,
        tipo: notificaciones.tipo,
        metadata: notificaciones.metadata,
        creadoEn: notificaciones.creadoEn,
        leido: sql<boolean>`CASE WHEN ${notificacionesConductorLeidas.leidoEn} IS NOT NULL THEN true ELSE false END`.as('leido'),
        leidoEn: notificacionesConductorLeidas.leidoEn,
      })
      .from(notificaciones)
      .innerJoin(notificacionesConductorLeidas, eq(notificaciones.id, notificacionesConductorLeidas.notificacionId))
      .where(and(eq(notificacionesConductorLeidas.conductorId, conductorId), eq(notificaciones.destino, 'conductor'), isNull(notificaciones.eliminadoEn), isNull(notificacionesConductorLeidas.ocultadoEn)))
      .orderBy(desc(notificaciones.creadoEn))
      .limit(limit)
      .offset(offset);

    const data = await query;

    const [totalResult] = await database
      .select({ count: count() })
      .from(notificacionesConductorLeidas)
      .innerJoin(notificaciones, eq(notificaciones.id, notificacionesConductorLeidas.notificacionId))
      .where(and(eq(notificacionesConductorLeidas.conductorId, conductorId), eq(notificaciones.destino, 'conductor'), isNull(notificaciones.eliminadoEn), isNull(notificacionesConductorLeidas.ocultadoEn)));

    return { data, total: Number(totalResult?.count || 0) };
  }

  async markAsReadByConductor(conductorId: number, notificacionId: number) {
    // Check if notification relation exists
    const [relation] = await database
      .select()
      .from(notificacionesConductorLeidas)
      .where(and(eq(notificacionesConductorLeidas.conductorId, conductorId), eq(notificacionesConductorLeidas.notificacionId, notificacionId)));

    if (!relation) return null;
    if (relation.leidoEn) return relation; // Already read

    const [updated] = await database
      .update(notificacionesConductorLeidas)
      .set({ leidoEn: new Date() })
      .where(eq(notificacionesConductorLeidas.id, relation.id))
      .returning();

    return updated;
  }

  async dismissByConductor(conductorId: number, notificacionId: number) {
    const [relation] = await database
      .select()
      .from(notificacionesConductorLeidas)
      .where(and(eq(notificacionesConductorLeidas.conductorId, conductorId), eq(notificacionesConductorLeidas.notificacionId, notificacionId)));

    if (!relation) return null;

    const [updated] = await database
      .update(notificacionesConductorLeidas)
      .set({ ocultadoEn: new Date(), leidoEn: relation.leidoEn || new Date() })
      .where(eq(notificacionesConductorLeidas.id, relation.id))
      .returning();

    return updated;
  }

  async getDocumentosVencimientosPorFecha(fechaReferencia: Date, diasAnticipacion: number = 7): Promise<DocumentoVencimiento[]> {
    // Calculate the limit date (fecha + diasAnticipacion)
    const fechaLimite = new Date(fechaReferencia);
    fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);

    const results: DocumentoVencimiento[] = [];

    // 1. CONDUCTOR DOCUMENTS
    const conductorResults = await this.getConductorDocumentosVencidos(fechaLimite);
    results.push(...conductorResults);

    // 2. VEHICULO DOCUMENTS
    const vehiculoResults = await this.getVehiculoDocumentosVencidos(fechaLimite);
    results.push(...vehiculoResults);

    return results;
  }

  private async getConductorDocumentosVencidos(fechaLimite: Date): Promise<ConductorDocumentoVencimiento[]> {
    // Find the latest document per (conductorId, tipo) by creation date
    const latestDocs = database
      .select({
        conductorId: conductorDocumentos.conductorId,
        tipo: conductorDocumentos.tipo,
        maxCreadoEn: sql<string>`MAX(${conductorDocumentos.creadoEn})`.as('max_creado_en'),
      })
      .from(conductorDocumentos)
      .groupBy(conductorDocumentos.conductorId, conductorDocumentos.tipo)
      .as('latest_docs');

    const results = await database
      .select({
        documentoId: conductorDocumentos.id,
        tipoDocumento: conductorDocumentos.tipo,
        nombreDocumento: conductorDocumentos.nombre,
        fechaExpiracion: conductorDocumentos.fechaExpiracion,
        entidadId: conductores.id,
        entidadNombre: conductores.nombreCompleto,
        email: conductores.email,
      })
      .from(conductorDocumentos)
      .innerJoin(conductores, eq(conductorDocumentos.conductorId, conductores.id))
      .innerJoin(
        latestDocs,
        and(
          eq(conductorDocumentos.conductorId, latestDocs.conductorId),
          eq(conductorDocumentos.tipo, latestDocs.tipo),
          eq(conductorDocumentos.creadoEn, latestDocs.maxCreadoEn),
        ),
      )
      .where(
        and(
          isNull(conductores.eliminadoEn),
          // Only alert if the latest doc actually has an expiration date and it's within range
          isNotNull(conductorDocumentos.fechaExpiracion),
          lte(conductorDocumentos.fechaExpiracion, fechaLimite.toISOString().split('T')[0]),
        ),
      )
      .orderBy(conductorDocumentos.fechaExpiracion);

    return results.map((r) => ({
      entidad: 'conductor',
      documentoId: r.documentoId,
      tipoDocumento: r.tipoDocumento,
      nombreDocumento: r.nombreDocumento,
      fechaExpiracion: r.fechaExpiracion,
      entidadId: r.entidadId,
      entidadNombre: r.entidadNombre,
      email: r.email,
      diasRestantes: this.calcularDiasRestantes(r.fechaExpiracion),
    }));
  }

  private async getVehiculoDocumentosVencidos(fechaLimite: Date): Promise<VehiculoDocumentoVencimiento[]> {
    // Find the latest document per (vehiculoId, tipo) by creation date
    const latestDocs = database
      .select({
        vehiculoId: vehiculoDocumentos.vehiculoId,
        tipo: vehiculoDocumentos.tipo,
        maxCreadoEn: sql<string>`MAX(${vehiculoDocumentos.creadoEn})`.as('max_creado_en'),
      })
      .from(vehiculoDocumentos)
      .groupBy(vehiculoDocumentos.vehiculoId, vehiculoDocumentos.tipo)
      .as('latest_docs');

    const results = await database
      .select({
        documentoId: vehiculoDocumentos.id,
        tipoDocumento: vehiculoDocumentos.tipo,
        nombreDocumento: vehiculoDocumentos.nombre,
        fechaExpiracion: vehiculoDocumentos.fechaExpiracion,
        entidadId: vehiculos.id,
        placa: vehiculos.placa,
        marca: marcas.nombre,
        modelo: modelos.nombre,
      })
      .from(vehiculoDocumentos)
      .innerJoin(vehiculos, eq(vehiculoDocumentos.vehiculoId, vehiculos.id))
      .innerJoin(modelos, eq(vehiculos.modeloId, modelos.id))
      .innerJoin(marcas, eq(modelos.marcaId, marcas.id))
      .innerJoin(
        latestDocs,
        and(
          eq(vehiculoDocumentos.vehiculoId, latestDocs.vehiculoId),
          eq(vehiculoDocumentos.tipo, latestDocs.tipo),
          eq(vehiculoDocumentos.creadoEn, latestDocs.maxCreadoEn),
        ),
      )
      .where(
        and(
          isNull(vehiculos.eliminadoEn),
          // Only alert if the latest doc actually has an expiration date and it's within range
          isNotNull(vehiculoDocumentos.fechaExpiracion),
          lte(vehiculoDocumentos.fechaExpiracion, fechaLimite.toISOString().split('T')[0]),
        ),
      )
      .orderBy(vehiculoDocumentos.fechaExpiracion);

    return results.map((r) => ({
      entidad: 'vehiculo',
      documentoId: r.documentoId,
      tipoDocumento: r.tipoDocumento,
      nombreDocumento: r.nombreDocumento,
      fechaExpiracion: r.fechaExpiracion!,
      entidadId: r.entidadId,
      entidadNombre: `${r.placa} - ${r.marca} ${r.modelo}`,
      diasRestantes: this.calcularDiasRestantes(r.fechaExpiracion!),
    }));
  }

  /**
   * Helper: Calculate days remaining (negative = expired days ago)
   * Handles timezone correctly by parsing date strings as local dates
   */
  private calcularDiasRestantes(fechaExpiracion: Date | string): number {
    // Get today at midnight in local time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse expiration date as local time
    // If it's a string like "2025-12-24", parse it as local, not UTC
    let expDate: Date;
    if (typeof fechaExpiracion === 'string') {
      const [year, month, day] = fechaExpiracion.split('-').map(Number);
      expDate = new Date(year, month - 1, day); // month is 0-indexed
    } else {
      // If it's already a Date, we need to handle potential UTC offset
      // Check if the date was created from an ISO string (would be at midnight UTC)
      expDate = new Date(fechaExpiracion);
      // If hours/minutes suggest UTC offset issue, adjust
      if (expDate.getHours() !== 0) {
        expDate.setHours(0, 0, 0, 0);
      }
    }
    expDate.setHours(0, 0, 0, 0);

    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  async countUnreadByUsuario(usuarioId: number, destino: NotificacionDestino = 'sistema', entidad?: string, fechaInicio?: string, fechaFin?: string): Promise<number> {
    const conditions = [
      eq(notificaciones.destino, destino),
      isNull(notificaciones.eliminadoEn),
      isNull(notificacionesLeidas.ocultadoEn),
      isNull(notificacionesLeidas.id),
    ];
    if (entidad) {
      conditions.push(sql`${notificaciones.metadata}->>'entidad' = ${entidad}`);
    }
    if (fechaInicio) {
      conditions.push(gte(notificaciones.creadoEn, new Date(fechaInicio)));
    }
    if (fechaFin) {
      conditions.push(lte(notificaciones.creadoEn, new Date(fechaFin)));
    }

    const result = await database
      .select({ count: count() })
      .from(notificaciones)
      .leftJoin(
        notificacionesLeidas,
        and(
          eq(notificacionesLeidas.notificacionId, notificaciones.id),
          eq(notificacionesLeidas.usuarioId, usuarioId),
        ),
      )
      .where(and(...conditions));

    return Number(result[0]?.count || 0);
  }

  async findUsersByRole(role: string) {
    return await database
      .select({
        id: usuarios.id,
        nombres: usuarios.nombres,
        apellidos: usuarios.apellidos,
        nombreCompleto: usuarios.nombreCompleto,
        email: usuarios.email,
        roles: usuarios.roles,
      })
      .from(usuarios)
      .where(and(sql`${role} = ANY(${usuarios.roles})`, isNull(usuarios.eliminadoEn)));
  }
}
