import { Injectable } from "@nestjs/common";
import {
  NotificacionRepository,
  DocumentoVencimiento,
} from "@repository/notificacion.repository";

// Types for notification preview/generation
export interface NotificacionPreview {
  titulo: string;
  mensaje: string;
  tipo: "info" | "warning" | "error" | "success";
  entidad: "cliente" | "conductor" | "vehiculo" | "usuario";
  entidadId: number;
  entidadNombre: string;
  tipoDocumento: string;
  diasRestantes: number;
}

@Injectable()
export class NotificacionesService {
  constructor(
    private readonly notificacionRepository: NotificacionRepository
  ) {}

  // =============================================
  // EXISTING METHODS
  // =============================================

  async findAllByUser(usuarioId: number, page: number = 1, limit: number = 10) {
    const { data, total } =
      await this.notificacionRepository.findAllPaginatedByUsuario(
        usuarioId,
        page,
        limit
      );

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: any) {
    return await this.notificacionRepository.create(data);
  }

  async markAsRead(usuarioId: number, notificacionId: number) {
    return await this.notificacionRepository.markAsRead(
      usuarioId,
      notificacionId
    );
  }

  // =============================================
  // DOCUMENT EXPIRATION NOTIFICATION METHODS
  // =============================================

  /**
   * TEST MODE: Preview notifications that would be generated for documents
   * expiring within the anticipation window. Does NOT create notifications.
   *
   * @param fechaReferencia - Base date to check from
   * @param diasAnticipacion - Days ahead to look (default 7)
   * @returns Array of NotificacionPreview with potential notifications
   */
  async previewNotificacionesVencimiento(
    fechaReferencia: Date,
    diasAnticipacion: number = 7
  ): Promise<NotificacionPreview[]> {
    const documentosVencidos =
      await this.notificacionRepository.getDocumentosVencimientosPorFecha(
        fechaReferencia,
        diasAnticipacion
      );

    return this.transformarDocumentosANotificaciones(documentosVencidos);
  }

  /**
   * PRODUCTION MODE: Check for expired documents and create notifications.
   *
   * @param fechaReferencia - Base date to check from
   * @param diasAnticipacion - Days ahead to look (default 7)
   * @returns Object with created notifications and previews
   */
  async generarNotificacionesVencimiento(
    fechaReferencia: Date,
    diasAnticipacion: number = 7
  ) {
    const documentosVencidos =
      await this.notificacionRepository.getDocumentosVencimientosPorFecha(
        fechaReferencia,
        diasAnticipacion
      );

    const previews =
      this.transformarDocumentosANotificaciones(documentosVencidos);

    if (previews.length === 0) {
      return {
        message: "No hay documentos vencidos para notificar",
        created: 0,
        notifications: [],
      };
    }

    // Prepare data for bulk insert
    const notificacionesData = previews.map((preview) => ({
      titulo: preview.titulo,
      mensaje: preview.mensaje,
      tipo: preview.tipo,
    }));

    const createdNotifications =
      await this.notificacionRepository.createMany(notificacionesData);

    return {
      message: `Se crearon ${createdNotifications.length} notificaciones`,
      created: createdNotifications.length,
      notifications: createdNotifications,
      previews,
    };
  }

  /**
   * Transforms document expiration data into notification previews
   */
  private transformarDocumentosANotificaciones(
    documentos: DocumentoVencimiento[]
  ): NotificacionPreview[] {
    return documentos.map((doc) => {
      const { titulo, mensaje, tipo } = this.generarContenidoNotificacion(doc);

      return {
        titulo,
        mensaje,
        tipo,
        entidad: doc.entidad,
        entidadId: doc.entidadId,
        entidadNombre: doc.entidadNombre,
        tipoDocumento: doc.tipoDocumento,
        diasRestantes: doc.diasRestantes,
      };
    });
  }

  /**
   * Generates notification content based on document expiration status
   */
  private generarContenidoNotificacion(doc: DocumentoVencimiento): {
    titulo: string;
    mensaje: string;
    tipo: "info" | "warning" | "error" | "success";
  } {
    const tipoDocFormateado = this.formatearTipoDocumento(doc.tipoDocumento);
    const entidadLabel = this.getEntidadLabel(doc.entidad);

    if (doc.diasRestantes < 0) {
      // Document already expired
      const diasVencido = Math.abs(doc.diasRestantes);
      return {
        titulo: `${tipoDocFormateado} vencido hace ${diasVencido} día${diasVencido > 1 ? "s" : ""}`,
        mensaje: `El documento "${tipoDocFormateado}" de ${entidadLabel} "${doc.entidadNombre}" venció el ${this.formatearFecha(doc.fechaExpiracion)}. Por favor actualice este documento lo antes posible.`,
        tipo: "error",
      };
    } else if (doc.diasRestantes === 0) {
      // Expires today
      return {
        titulo: `${tipoDocFormateado} vence HOY`,
        mensaje: `El documento "${tipoDocFormateado}" de ${entidadLabel} "${doc.entidadNombre}" vence hoy ${this.formatearFecha(doc.fechaExpiracion)}. Tome acción inmediata.`,
        tipo: "error",
      };
    } else if (doc.diasRestantes <= 7) {
      // Expires within a week
      return {
        titulo: `${tipoDocFormateado} próximo a vencer`,
        mensaje: `El documento "${tipoDocFormateado}" de ${entidadLabel} "${doc.entidadNombre}" vencerá en ${doc.diasRestantes} día${doc.diasRestantes > 1 ? "s" : ""} (${this.formatearFecha(doc.fechaExpiracion)}). Planifique su renovación.`,
        tipo: "warning",
      };
    } else {
      // More than a week away but still flagged
      return {
        titulo: `${tipoDocFormateado} por vencer`,
        mensaje: `El documento "${tipoDocFormateado}" de ${entidadLabel} "${doc.entidadNombre}" vencerá el ${this.formatearFecha(doc.fechaExpiracion)} (${doc.diasRestantes} días restantes).`,
        tipo: "info",
      };
    }
  }

  /**
   * Formats document type enum to human-readable string
   */
  private formatearTipoDocumento(tipo: string): string {
    const formatMap: Record<string, string> = {
      // Cliente
      dni: "DNI",
      ruc: "RUC",
      contrato: "Contrato",
      carta_compromiso: "Carta de Compromiso",
      ficha_ruc: "Ficha RUC",
      // Conductor
      licencia_mtc: "Licencia MTC",
      seguro_vida_ley: "Seguro Vida Ley",
      sctr: "SCTR",
      examen_medico: "Examen Médico",
      psicosensometrico: "Psicosensométrico",
      induccion_general: "Inducción General",
      manejo_defensivo: "Manejo Defensivo",
      licencia_interna: "Licencia Interna",
      // Vehiculo
      tarjeta_propiedad: "Tarjeta de Propiedad",
      tarjeta_unica_circulacion: "TUC",
      citv: "CITV",
      soat: "SOAT",
      poliza: "Póliza",
      certificado_operatividad_factura: "Cert. Operatividad",
      plan_mantenimiento_historico: "Plan Mantenimiento",
      certificado_instalacion_gps: "Cert. GPS",
      certificado_valor_anadido: "Cert. Valor Añadido",
      constancia_gps: "Constancia GPS",
      certificado_tacos: "Cert. Tacos",
      certificado_extintores_hidrostatica: "Cert. Extintores",
      certificado_norma_r66: "Cert. Norma R66",
      certificado_laminados_lunas: "Cert. Laminados",
      certificado_carroceria: "Cert. Carrocería",
      certificado_caracteristicas_tecnicas: "Cert. Caract. Técnicas",
      certificado_adas: "Cert. ADAS",
      // General
      otros: "Otros",
    };

    return formatMap[tipo] || tipo.replace(/_/g, " ").toUpperCase();
  }

  /**
   * Gets entity type label
   */
  private getEntidadLabel(entidad: string): string {
    const labels: Record<string, string> = {
      cliente: "Cliente",
      conductor: "Conductor",
      vehiculo: "Vehículo",
      usuario: "Usuario",
    };
    return labels[entidad] || entidad;
  }

  /**
   * Formats date to Spanish locale (handles timezone correctly)
   */
  private formatearFecha(fechaStr: string): string {
    // Parse date string as local time, not UTC
    // "2025-12-08" should be Dec 8, not Dec 7
    const [year, month, day] = fechaStr.split("-").map(Number);
    const fecha = new Date(year, month - 1, day); // month is 0-indexed

    return fecha.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
}
