import { Injectable } from '@nestjs/common';
import { NotificacionRepository, DocumentoVencimiento } from '@repository/notificacion.repository';
import { PaginatedNotificacionResultDto } from './dto/notificacion-paginated.dto';
import { NotificacionResultDto } from './dto/notificacion-result.dto';
import { NotificacionCreateDto } from './dto/notificacion-create.dto';
import { GenerarVencimientosResultDto, NotificacionPreviewDto, PreviewVencimientosResultDto } from './dto/notificacion-vencimiento.dto';

export type NotificacionPreview = NotificacionPreviewDto;

@Injectable()
export class NotificacionesService {
  constructor(private readonly notificacionRepository: NotificacionRepository) {}

  async findAllByUser(usuarioId: number, page: number = 1, limit: number = 10): Promise<PaginatedNotificacionResultDto> {
    const { data, total } = await this.notificacionRepository.findAllPaginatedByUsuario(usuarioId, page, limit);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async create(data: NotificacionCreateDto): Promise<NotificacionResultDto> {
    const result = await this.notificacionRepository.create(data);
    return {
      ...result,
      leido: false,
    } as NotificacionResultDto;
  }

  async markAsRead(usuarioId: number, notificacionId: number): Promise<NotificacionResultDto> {
    const result = await this.notificacionRepository.markAsRead(usuarioId, notificacionId);
    if (!result) {
      throw new Error('Notificación no encontrada');
    }
    const notif = await this.notificacionRepository.findOne(notificacionId);
    return {
      ...notif,
      leido: true,
    } as NotificacionResultDto;
  }

  async previewNotificacionesVencimiento(fecha: string, diasAnticipacion: number = 7): Promise<PreviewVencimientosResultDto> {
    const fechaReferencia = new Date(fecha);
    const documentosVencidos = await this.notificacionRepository.getDocumentosVencimientosPorFecha(fechaReferencia, diasAnticipacion);
    const previews = this.transformarDocumentosANotificaciones(documentosVencidos);

    const fechaLimite = new Date(fechaReferencia);
    fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);

    return {
      parametros: {
        fechaReferencia: fecha,
        diasAnticipacion,
        fechaLimite: fechaLimite.toISOString().split('T')[0],
      },
      totalDocumentosEncontrados: previews.length,
      resumen: {
        clientes: previews.filter((p) => p.entidad === 'cliente').length,
        conductores: previews.filter((p) => p.entidad === 'conductor').length,
        vehiculos: previews.filter((p) => p.entidad === 'vehiculo').length,
        usuarios: previews.filter((p) => p.entidad === 'usuario').length,
        vencidos: previews.filter((p) => p.diasRestantes < 0).length,
        porVencer: previews.filter((p) => p.diasRestantes >= 0).length,
      },
      notificaciones: previews,
    };
  }

  async generarNotificacionesVencimiento(fecha: string, diasAnticipacion: number = 7): Promise<GenerarVencimientosResultDto> {
    const fechaReferencia = new Date(fecha);
    const documentosVencidos = await this.notificacionRepository.getDocumentosVencimientosPorFecha(fechaReferencia, diasAnticipacion);

    const previews = this.transformarDocumentosANotificaciones(documentosVencidos);

    if (previews.length === 0) {
      return {
        message: 'No hay documentos vencidos para notificar',
        created: 0,
        notifications: [],
        previews: [],
        parametros: {
          fechaReferencia: fecha,
          diasAnticipacion,
        },
      };
    }

    const notificacionesData = previews.map((preview) => ({
      titulo: preview.titulo,
      mensaje: preview.mensaje,
      tipo: preview.tipo,
    }));

    const createdNotifications = await this.notificacionRepository.createMany(notificacionesData);

    return {
      message: `Se crearon ${createdNotifications.length} notificaciones`,
      created: createdNotifications.length,
      notifications: createdNotifications.map((n) => ({ ...n, leido: false })) as NotificacionResultDto[],
      previews,
      parametros: {
        fechaReferencia: fecha,
        diasAnticipacion,
      },
    };
  }

  private transformarDocumentosANotificaciones(documentos: DocumentoVencimiento[]): NotificacionPreview[] {
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

  private generarContenidoNotificacion(doc: DocumentoVencimiento): {
    titulo: string;
    mensaje: string;
    tipo: 'info' | 'warning' | 'error' | 'success';
  } {
    const tipoDocFormateado = this.formatearTipoDocumento(doc.tipoDocumento);
    const entidadLabel = this.getEntidadLabel(doc.entidad);

    if (doc.diasRestantes < 0) {
      const diasVencido = Math.abs(doc.diasRestantes);
      return {
        titulo: `${tipoDocFormateado} vencido hace ${diasVencido} día${diasVencido > 1 ? 's' : ''}`,
        mensaje: `El documento "${tipoDocFormateado}" de ${entidadLabel} "${doc.entidadNombre}" venció el ${this.formatearFecha(doc.fechaExpiracion)}. Por favor actualice este documento lo antes posible.`,
        tipo: 'error',
      };
    } else if (doc.diasRestantes === 0) {
      return {
        titulo: `${tipoDocFormateado} vence HOY`,
        mensaje: `El documento "${tipoDocFormateado}" de ${entidadLabel} "${doc.entidadNombre}" vence hoy ${this.formatearFecha(doc.fechaExpiracion)}. Tome acción inmediata.`,
        tipo: 'error',
      };
    } else if (doc.diasRestantes <= 7) {
      return {
        titulo: `${tipoDocFormateado} próximo a vencer`,
        mensaje: `El documento "${tipoDocFormateado}" de ${entidadLabel} "${doc.entidadNombre}" vencerá en ${doc.diasRestantes} día${doc.diasRestantes > 1 ? 's' : ''} (${this.formatearFecha(doc.fechaExpiracion)}). Planifique su renovación.`,
        tipo: 'warning',
      };
    } else {
      return {
        titulo: `${tipoDocFormateado} por vencer`,
        mensaje: `El documento "${tipoDocFormateado}" de ${entidadLabel} "${doc.entidadNombre}" vencerá el ${this.formatearFecha(doc.fechaExpiracion)} (${doc.diasRestantes} días restantes).`,
        tipo: 'info',
      };
    }
  }

  private formatearTipoDocumento(tipo: string): string {
    const formatMap: Record<string, string> = {
      dni: 'DNI',
      ruc: 'RUC',
      contrato: 'Contrato',
      carta_compromiso: 'Carta de Compromiso',
      ficha_ruc: 'Ficha RUC',
      licencia_mtc: 'Licencia MTC',
      seguro_vida_ley: 'Seguro Vida Ley',
      sctr: 'SCTR',
      examen_medico: 'Examen Médico',
      psicosensometrico: 'Psicosensométrico',
      induccion_general: 'Inducción General',
      manejo_defensivo: 'Manejo Defensivo',
      licencia_interna: 'Licencia Interna',
      tarjeta_propiedad: 'Tarjeta de Propiedad',
      tarjeta_unica_circulacion: 'TUC',
      citv: 'CITV',
      soat: 'SOAT',
      poliza: 'Póliza',
      certificado_operatividad_factura: 'Cert. Operatividad',
      plan_mantenimiento_historico: 'Plan Mantenimiento',
      certificado_instalacion_gps: 'Cert. GPS',
      certificado_valor_anadido: 'Cert. Valor Añadido',
      constancia_gps: 'Constancia GPS',
      certificado_tacos: 'Cert. Tacos',
      certificado_extintores_hidrostatica: 'Cert. Extintores',
      certificado_norma_r66: 'Cert. Norma R66',
      certificado_laminados_lunas: 'Cert. Laminados',
      certificado_carroceria: 'Cert. Carrocería',
      certificado_caracteristicas_tecnicas: 'Cert. Caract. Técnicas',
      certificado_adas: 'Cert. ADAS',
      otros: 'Otros',
    };

    return formatMap[tipo] || tipo.replace(/_/g, ' ').toUpperCase();
  }

  private getEntidadLabel(entidad: string): string {
    const labels: Record<string, string> = {
      cliente: 'Cliente',
      conductor: 'Conductor',
      vehiculo: 'Vehículo',
      usuario: 'Usuario',
    };
    return labels[entidad] || entidad;
  }

  private formatearFecha(fechaStr: string): string {
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);

    return fecha.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
}
