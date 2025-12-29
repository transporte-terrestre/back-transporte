import { Injectable } from '@nestjs/common';
import { database } from '@db/connection.db';
import { notificaciones } from '@model/tables/notificacion.model';
import { notificacionesLeidas } from '@model/tables/notificacion-leida.model';
import { clienteDocumentos } from '@model/tables/cliente-documento.model';
import { conductorDocumentos } from '@model/tables/conductor-documento.model';
import { vehiculoDocumentos } from '@model/tables/vehiculo-documento.model';
import { usuarioDocumentos } from '@model/tables/usuario-documento.model';
import { clientes } from '@model/tables/cliente.model';
import { conductores } from '@model/tables/conductor.model';
import { vehiculos } from '@model/tables/vehiculo.model';
import { modelos } from '@model/tables/modelo.model';
import { marcas } from '@model/tables/marca.model';
import { usuarios } from '@model/tables/usuario.model';
import { propietarioDocumentos } from '@model/tables/propietario-documento.model';
import { propietarios } from '@model/tables/propietario.model';
import { eq, and, desc, isNull, count, sql, lte, isNotNull } from 'drizzle-orm';

// Types for document expiration results
export interface DocumentoVencimientoBase {
  documentoId: number;
  tipoDocumento: string;
  nombreDocumento: string;
  fechaExpiracion: string;
  diasRestantes: number; // negative = expired, positive = days until expiration
}

export interface ClienteDocumentoVencimiento extends DocumentoVencimientoBase {
  entidad: 'cliente';
  entidadId: number;
  entidadNombre: string;
}

export interface ConductorDocumentoVencimiento extends DocumentoVencimientoBase {
  entidad: 'conductor';
  entidadId: number;
  entidadNombre: string;
}

export interface VehiculoDocumentoVencimiento extends DocumentoVencimientoBase {
  entidad: 'vehiculo';
  entidadId: number;
  entidadNombre: string; // placa - marca modelo
}

export interface UsuarioDocumentoVencimiento extends DocumentoVencimientoBase {
  entidad: 'usuario';
  entidadId: number;
  entidadNombre: string;
}

export interface PropietarioDocumentoVencimiento extends DocumentoVencimientoBase {
  entidad: 'propietario';
  entidadId: number;
  entidadNombre: string;
}

export type DocumentoVencimiento =
  | ClienteDocumentoVencimiento
  | ConductorDocumentoVencimiento
  | VehiculoDocumentoVencimiento
  | UsuarioDocumentoVencimiento
  | PropietarioDocumentoVencimiento;

@Injectable()
export class NotificacionRepository {
  // =============================================
  // EXISTING METHODS
  // =============================================

  async findAllPaginatedByUsuario(usuarioId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const query = database
      .select({
        id: notificaciones.id,
        titulo: notificaciones.titulo,
        mensaje: notificaciones.mensaje,
        tipo: notificaciones.tipo,
        creadoEn: notificaciones.creadoEn,
        leido: sql<boolean>`CASE WHEN ${notificacionesLeidas.id} IS NOT NULL THEN true ELSE false END`.as('leido'),
      })
      .from(notificaciones)
      .leftJoin(notificacionesLeidas, and(eq(notificacionesLeidas.notificacionId, notificaciones.id), eq(notificacionesLeidas.usuarioId, usuarioId)))
      .where(isNull(notificaciones.eliminadoEn))
      .orderBy(desc(notificaciones.creadoEn))
      .limit(limit)
      .offset(offset);

    const data = await query;
    const totalResult = await database.select({ count: count() }).from(notificaciones).where(isNull(notificaciones.eliminadoEn));

    return { data, total: Number(totalResult[0]?.count || 0) };
  }

  async findOne(id: number) {
    const [result] = await database
      .select()
      .from(notificaciones)
      .where(and(eq(notificaciones.id, id), isNull(notificaciones.eliminadoEn)));
    return result;
  }

  async create(data: any) {
    const result = await database.insert(notificaciones).values(data).returning();
    return result[0];
  }

  async createMany(data: any[]) {
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
      })
      .returning();

    return result[0];
  }

  async getDocumentosVencimientosPorFecha(fechaReferencia: Date, diasAnticipacion: number = 7): Promise<DocumentoVencimiento[]> {
    // Calculate the limit date (fecha + diasAnticipacion)
    const fechaLimite = new Date(fechaReferencia);
    fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);

    const results: DocumentoVencimiento[] = [];

    // 1. CLIENTE DOCUMENTS
    const clienteResults = await this.getClienteDocumentosVencidos(fechaLimite);
    results.push(...clienteResults);

    // 2. CONDUCTOR DOCUMENTS
    const conductorResults = await this.getConductorDocumentosVencidos(fechaLimite);
    results.push(...conductorResults);

    // 3. VEHICULO DOCUMENTS
    const vehiculoResults = await this.getVehiculoDocumentosVencidos(fechaLimite);
    results.push(...vehiculoResults);

    // 4. USUARIO DOCUMENTS
    const usuarioResults = await this.getUsuarioDocumentosVencidos(fechaLimite);
    results.push(...usuarioResults);

    // 5. PROPIETARIO DOCUMENTS
    const propietarioResults = await this.getPropietarioDocumentosVencidos(fechaLimite);
    results.push(...propietarioResults);

    return results;
  }

  private async getClienteDocumentosVencidos(fechaLimite: Date): Promise<ClienteDocumentoVencimiento[]> {
    // Subquery: Get max fecha_expiracion per (cliente_id, tipo)
    const latestDocs = database
      .select({
        clienteId: clienteDocumentos.clienteId,
        tipo: clienteDocumentos.tipo,
        maxFechaExp: sql<string>`MAX(${clienteDocumentos.fechaExpiracion})`.as('max_fecha_exp'),
      })
      .from(clienteDocumentos)
      .where(isNotNull(clienteDocumentos.fechaExpiracion))
      .groupBy(clienteDocumentos.clienteId, clienteDocumentos.tipo)
      .as('latest_docs');

    // Main query: Join to get document details + client info, filter by fecha <= fechaLimite
    const results = await database
      .select({
        documentoId: clienteDocumentos.id,
        tipoDocumento: clienteDocumentos.tipo,
        nombreDocumento: clienteDocumentos.nombre,
        fechaExpiracion: clienteDocumentos.fechaExpiracion,
        entidadId: clientes.id,
        entidadNombre: clientes.nombreCompleto,
      })
      .from(clienteDocumentos)
      .innerJoin(clientes, eq(clienteDocumentos.clienteId, clientes.id))
      .innerJoin(
        latestDocs,
        and(
          eq(clienteDocumentos.clienteId, latestDocs.clienteId),
          eq(clienteDocumentos.tipo, latestDocs.tipo),
          eq(clienteDocumentos.fechaExpiracion, latestDocs.maxFechaExp),
        ),
      )
      .where(
        and(
          isNull(clientes.eliminadoEn),
          isNotNull(clienteDocumentos.fechaExpiracion),
          lte(clienteDocumentos.fechaExpiracion, fechaLimite.toISOString().split('T')[0]),
        ),
      )
      .orderBy(clienteDocumentos.fechaExpiracion);

    return results.map((r) => ({
      entidad: 'cliente' as const,
      documentoId: r.documentoId,
      tipoDocumento: r.tipoDocumento,
      nombreDocumento: r.nombreDocumento,
      fechaExpiracion: r.fechaExpiracion!,
      entidadId: r.entidadId,
      entidadNombre: r.entidadNombre,
      diasRestantes: this.calcularDiasRestantes(r.fechaExpiracion!),
    }));
  }

  private async getConductorDocumentosVencidos(fechaLimite: Date): Promise<ConductorDocumentoVencimiento[]> {
    const latestDocs = database
      .select({
        conductorId: conductorDocumentos.conductorId,
        tipo: conductorDocumentos.tipo,
        maxFechaExp: sql<string>`MAX(${conductorDocumentos.fechaExpiracion})`.as('max_fecha_exp'),
      })
      .from(conductorDocumentos)
      .where(isNotNull(conductorDocumentos.fechaExpiracion))
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
      })
      .from(conductorDocumentos)
      .innerJoin(conductores, eq(conductorDocumentos.conductorId, conductores.id))
      .innerJoin(
        latestDocs,
        and(
          eq(conductorDocumentos.conductorId, latestDocs.conductorId),
          eq(conductorDocumentos.tipo, latestDocs.tipo),
          eq(conductorDocumentos.fechaExpiracion, latestDocs.maxFechaExp),
        ),
      )
      .where(
        and(
          isNull(conductores.eliminadoEn),
          isNotNull(conductorDocumentos.fechaExpiracion),
          lte(conductorDocumentos.fechaExpiracion, fechaLimite.toISOString().split('T')[0]),
        ),
      )
      .orderBy(conductorDocumentos.fechaExpiracion);

    return results.map((r) => ({
      entidad: 'conductor' as const,
      documentoId: r.documentoId,
      tipoDocumento: r.tipoDocumento,
      nombreDocumento: r.nombreDocumento,
      fechaExpiracion: r.fechaExpiracion,
      entidadId: r.entidadId,
      entidadNombre: r.entidadNombre,
      diasRestantes: this.calcularDiasRestantes(r.fechaExpiracion),
    }));
  }

  private async getVehiculoDocumentosVencidos(fechaLimite: Date): Promise<VehiculoDocumentoVencimiento[]> {
    const latestDocs = database
      .select({
        vehiculoId: vehiculoDocumentos.vehiculoId,
        tipo: vehiculoDocumentos.tipo,
        maxFechaExp: sql<string>`MAX(${vehiculoDocumentos.fechaExpiracion})`.as('max_fecha_exp'),
      })
      .from(vehiculoDocumentos)
      .where(isNotNull(vehiculoDocumentos.fechaExpiracion))
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
          eq(vehiculoDocumentos.fechaExpiracion, latestDocs.maxFechaExp),
        ),
      )
      .where(
        and(
          isNull(vehiculos.eliminadoEn),
          isNotNull(vehiculoDocumentos.fechaExpiracion),
          lte(vehiculoDocumentos.fechaExpiracion, fechaLimite.toISOString().split('T')[0]),
        ),
      )
      .orderBy(vehiculoDocumentos.fechaExpiracion);

    return results.map((r) => ({
      entidad: 'vehiculo' as const,
      documentoId: r.documentoId,
      tipoDocumento: r.tipoDocumento,
      nombreDocumento: r.nombreDocumento,
      fechaExpiracion: r.fechaExpiracion!,
      entidadId: r.entidadId,
      entidadNombre: `${r.placa} - ${r.marca} ${r.modelo}`,
      diasRestantes: this.calcularDiasRestantes(r.fechaExpiracion!),
    }));
  }

  private async getUsuarioDocumentosVencidos(fechaLimite: Date): Promise<UsuarioDocumentoVencimiento[]> {
    const latestDocs = database
      .select({
        usuarioId: usuarioDocumentos.usuarioId,
        tipo: usuarioDocumentos.tipo,
        maxFechaExp: sql<string>`MAX(${usuarioDocumentos.fechaExpiracion})`.as('max_fecha_exp'),
      })
      .from(usuarioDocumentos)
      .where(isNotNull(usuarioDocumentos.fechaExpiracion))
      .groupBy(usuarioDocumentos.usuarioId, usuarioDocumentos.tipo)
      .as('latest_docs');

    const results = await database
      .select({
        documentoId: usuarioDocumentos.id,
        tipoDocumento: usuarioDocumentos.tipo,
        nombreDocumento: usuarioDocumentos.nombre,
        fechaExpiracion: usuarioDocumentos.fechaExpiracion,
        entidadId: usuarios.id,
        entidadNombre: usuarios.nombreCompleto,
      })
      .from(usuarioDocumentos)
      .innerJoin(usuarios, eq(usuarioDocumentos.usuarioId, usuarios.id))
      .innerJoin(
        latestDocs,
        and(
          eq(usuarioDocumentos.usuarioId, latestDocs.usuarioId),
          eq(usuarioDocumentos.tipo, latestDocs.tipo),
          eq(usuarioDocumentos.fechaExpiracion, latestDocs.maxFechaExp),
        ),
      )
      .where(
        and(
          isNull(usuarios.eliminadoEn),
          isNotNull(usuarioDocumentos.fechaExpiracion),
          lte(usuarioDocumentos.fechaExpiracion, fechaLimite.toISOString().split('T')[0]),
        ),
      )
      .orderBy(usuarioDocumentos.fechaExpiracion);

    return results.map((r) => ({
      entidad: 'usuario' as const,
      documentoId: r.documentoId,
      tipoDocumento: r.tipoDocumento,
      nombreDocumento: r.nombreDocumento,
      fechaExpiracion: r.fechaExpiracion!,
      entidadId: r.entidadId,
      entidadNombre: r.entidadNombre,
      diasRestantes: this.calcularDiasRestantes(r.fechaExpiracion!),
    }));
  }

  private async getPropietarioDocumentosVencidos(fechaLimite: Date): Promise<PropietarioDocumentoVencimiento[]> {
    const latestDocs = database
      .select({
        propietarioId: propietarioDocumentos.propietarioId,
        tipo: propietarioDocumentos.tipo,
        maxFechaExp: sql<string>`MAX(${propietarioDocumentos.fechaExpiracion})`.as('max_fecha_exp'),
      })
      .from(propietarioDocumentos)
      .where(isNotNull(propietarioDocumentos.fechaExpiracion))
      .groupBy(propietarioDocumentos.propietarioId, propietarioDocumentos.tipo)
      .as('latest_docs');

    const results = await database
      .select({
        documentoId: propietarioDocumentos.id,
        tipoDocumento: propietarioDocumentos.tipo,
        nombreDocumento: propietarioDocumentos.nombre,
        fechaExpiracion: propietarioDocumentos.fechaExpiracion,
        entidadId: propietarios.id,
        entidadNombre: propietarios.nombreCompleto,
      })
      .from(propietarioDocumentos)
      .innerJoin(propietarios, eq(propietarioDocumentos.propietarioId, propietarios.id))
      .innerJoin(
        latestDocs,
        and(
          eq(propietarioDocumentos.propietarioId, latestDocs.propietarioId),
          eq(propietarioDocumentos.tipo, latestDocs.tipo),
          eq(propietarioDocumentos.fechaExpiracion, latestDocs.maxFechaExp),
        ),
      )
      .where(
        and(
          isNull(propietarios.eliminadoEn),
          isNotNull(propietarioDocumentos.fechaExpiracion),
          lte(propietarioDocumentos.fechaExpiracion, fechaLimite.toISOString().split('T')[0]),
        ),
      )
      .orderBy(propietarioDocumentos.fechaExpiracion);

    return results.map((r) => ({
      entidad: 'propietario' as const,
      documentoId: r.documentoId,
      tipoDocumento: r.tipoDocumento,
      nombreDocumento: r.nombreDocumento,
      fechaExpiracion: r.fechaExpiracion!,
      entidadId: r.entidadId,
      entidadNombre: r.entidadNombre,
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
}
