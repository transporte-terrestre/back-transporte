import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotificacionRepository, DocumentoVencimiento } from '@repository/notificacion.repository';
import { PaginatedNotificacionResultDto } from './dto/notificacion/notificacion-paginated.dto';
import { NotificacionResultDto } from './dto/notificacion/notificacion-result.dto';
import { NotificacionCreateDto } from './dto/notificacion/notificacion-create.dto';
import { GenerarVencimientosResultDto, NotificacionPreviewDto, PreviewVencimientosResultDto } from './dto/notificacion/notificacion-vencimiento.dto';
import { SendEmailDto } from './dto/email/send-email.dto';
import * as nodemailer from 'nodemailer';

export type NotificacionPreview = NotificacionPreviewDto;

@Injectable()
export class NotificacionesService {
  constructor(private readonly notificacionRepository: NotificacionRepository) {}

  async sendEmail(dto: SendEmailDto): Promise<{ message: string }> {
    const user = process.env.GMAIL_EMAIL;
    const pass = process.env.GMAIL_PASSWORD;

    if (!user || !pass) {
      console.error('Faltan credenciales GMAIL_EMAIL o GMAIL_PASSWORD en .env');
      throw new InternalServerErrorException('Configuración de correo incompleta en el servidor');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: `"Notificaciones Transporte" <${user}>`,
        to: dto.to,
        subject: dto.subject,
        text: dto.text,
        html: dto.html || dto.text, // Fallback to text if html is missing, though type definition makes html optional
      });
      console.log('Correo enviado: %s', info.messageId);
      return { message: 'Correo enviado correctamente' };
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new InternalServerErrorException('No se pudo enviar el correo: ' + (error as any).message);
    }
  }

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

  async createForConductor(conductorId: number, data: NotificacionCreateDto): Promise<NotificacionResultDto> {
    const result = await this.notificacionRepository.createForConductor(conductorId, data);
    return {
      ...result,
      leido: false,
    } as NotificacionResultDto;
  }

  async findAllByConductor(conductorId: number, page: number = 1, limit: number = 10): Promise<PaginatedNotificacionResultDto> {
    const { data, total } = await this.notificacionRepository.findAllPaginatedByConductor(conductorId, page, limit);

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

  async markAsReadByConductor(conductorId: number, notificacionId: number): Promise<NotificacionResultDto> {
    const result = await this.notificacionRepository.markAsReadByConductor(conductorId, notificacionId);
    if (!result) {
      throw new Error('Notificación no encontrada o no asignada al conductor');
    }
    const notif = await this.notificacionRepository.findOne(notificacionId);
    return {
      ...notif,
      leido: true,
    } as NotificacionResultDto;
  }

  async notifyEachAdmin(diasAnticipacion: number = 7): Promise<{ message: string; count: number }> {
    const today = new Date().toISOString().split('T')[0];
    const fechaReferencia = new Date(today);

    // Get all expirations
    const allExpirations = await this.notificacionRepository.getDocumentosVencimientosPorFecha(fechaReferencia, diasAnticipacion);

    // Filter only conductors
    const conductorExpirations = allExpirations.filter((doc) => doc.entidad === 'conductor');

    // Get all admins
    const admins = await this.notificacionRepository.findUsersByRole('admin');
    const adminEmails = admins.map((u) => u.email).filter((e) => e);

    if (adminEmails.length === 0) {
      return { message: 'No hay administradores a quienes enviar el reporte.', count: 0 };
    }

    if (conductorExpirations.length === 0) {
      // Send email saying no expirations found to all admins
      for (const email of adminEmails) {
        try {
          await this.sendEmail({
            to: email,
            subject: 'Reporte de Vencimientos de Conductores',
            text: 'No hay documentos de conductores próximos a vencer.',
            html:
              '<h3>Reporte de Vencimientos</h3><p>No se encontraron documentos de conductores próximos a vencer en los siguientes ' +
              diasAnticipacion +
              ' días.</p>',
          });
        } catch (e) {
          console.error(`Error sending "no expiration" email to admin ${email}`, e);
        }
      }
      return { message: 'No se encontraron vencimientos. Reporte enviado a admins.', count: 0 };
    }

    // Sort by expiration date (most urgent first)
    conductorExpirations.sort((a, b) => a.diasRestantes - b.diasRestantes);

    // Generate HTML Table
    let htmlContent = `
      <h2>Reporte de Documentos de Conductores por Vencer</h2>
      <p>Se encontraron <strong>${conductorExpirations.length}</strong> documentos con vencimiento próximo (dentro de ${diasAnticipacion} días) o vencidos.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Conductor</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Documento</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Fecha Venc.</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Estado</th>
          </tr>
        </thead>
        <tbody>
    `;

    conductorExpirations.forEach((doc) => {
      const dias = doc.diasRestantes;
      let estadoColor = '#28a745'; // Green
      let estadoText = 'Vigente';

      if (dias < 0) {
        estadoColor = '#dc3545'; // Red
        estadoText = `Vencido hace ${Math.abs(dias)} días`;
      } else if (dias === 0) {
        estadoColor = '#dc3545';
        estadoText = 'Vence HOY';
      } else if (dias <= 7) {
        estadoColor = '#ffc107'; // Yellow
        estadoText = `Vence en ${dias} días`;
      }

      htmlContent += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${doc.entidadNombre}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${this.formatearTipoDocumento(doc.tipoDocumento)} - ${doc.nombreDocumento}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${this.formatearFecha(doc.fechaExpiracion)}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: ${estadoColor}; font-weight: bold;">${estadoText}</td>
        </tr>
      `;
    });

    htmlContent += `
        </tbody>
      </table>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">Generado automáticamente por el Sistema de Transporte.</p>
    `;

    let successful = 0;
    for (const email of adminEmails) {
      try {
        await this.sendEmail({
          to: email,
          subject: `[ALERTA] ${conductorExpirations.length} Documentos de Conductores por Vencer`,
          text: `Se encontraron ${conductorExpirations.length} documentos de conductores por vencer. Por favor revise el formato HTML.`,
          html: htmlContent,
        });
        successful++;
      } catch (e) {
        console.error(`Error sending email to admin ${email}`, e);
      }
    }

    return {
      message: `Correo enviado a ${successful}/${adminEmails.length} administradores con la lista de conductores.`,
      count: conductorExpirations.length,
    };
  }

  async notifyEachConductor(diasAnticipacion: number = 7): Promise<{ message: string; successful: number; failed: number }> {
    const today = new Date().toISOString().split('T')[0];
    const fechaReferencia = new Date(today);

    // Get all expirations
    const allExpirations = await this.notificacionRepository.getDocumentosVencimientosPorFecha(fechaReferencia, diasAnticipacion);

    // Filter only conductors and ensure they have an email
    const conductorExpirations = allExpirations.filter(
      (doc) => doc.entidad === 'conductor',
    ) as import('@repository/notificacion.repository').ConductorDocumentoVencimiento[];

    if (conductorExpirations.length === 0) {
      return { message: 'No se encontraron documentos de conductores por vencer.', successful: 0, failed: 0 };
    }

    // Group by Email
    const conductorsMap = new Map<string, { name: string; docs: typeof conductorExpirations }>();

    conductorExpirations.forEach((doc) => {
      if (doc.email) {
        if (!conductorsMap.has(doc.email)) {
          conductorsMap.set(doc.email, { name: doc.entidadNombre, docs: [] });
        }
        conductorsMap.get(doc.email)!.docs.push(doc);
      } else {
        console.warn(`Conductor ${doc.entidadNombre} (ID: ${doc.entidadId}) tiene documentos vencidos pero NO tiene email registrado.`);
      }
    });

    let successful = 0;
    let failed = 0;

    for (const [email, { name, docs }] of conductorsMap.entries()) {
      try {
        // Sort docs by urgency
        docs.sort((a, b) => a.diasRestantes - b.diasRestantes);

        let htmlContent = `
          <h3>Estimado/a ${name},</h3>
          <p>Le informamos que tiene los siguientes documentos pendientes de renovación o vencidos:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Documento</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Fecha Vencimiento</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Estado</th>
              </tr>
            </thead>
            <tbody>
        `;

        docs.forEach((doc) => {
          const dias = doc.diasRestantes;
          let estadoColor = '#28a745';
          let estadoText = 'Vigente';

          if (dias < 0) {
            estadoColor = '#dc3545';
            estadoText = `Vencido hace ${Math.abs(dias)} días`;
          } else if (dias === 0) {
            estadoColor = '#dc3545';
            estadoText = 'Vence HOY';
          } else if (dias <= 7) {
            estadoColor = '#ffc107';
            estadoText = `Vence en ${dias} días`;
          }

          htmlContent += `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${this.formatearTipoDocumento(doc.tipoDocumento)} - ${doc.nombreDocumento}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${this.formatearFecha(doc.fechaExpiracion)}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: ${estadoColor}; font-weight: bold;">${estadoText}</td>
            </tr>
          `;
        });

        htmlContent += `
            </tbody>
          </table>
          <p>Por favor, gestione la renovación de estos documentos a la brevedad para evitar inconvenientes en sus operaciones.</p>
          <p style="font-size: 12px; color: #888;">Atentamente,<br>El equipo de Gestión de Transporte</p>
        `;

        await this.sendEmail({
          to: email,
          subject: 'Aviso de Vencimiento de Documentos',
          text: `Estimado ${name}, tiene ${docs.length} documento(s) por vencer. Por favor revise el correo HTML para más detalles.`,
          html: htmlContent,
        });

        successful++;
      } catch (error) {
        console.error(`Error enviando correo a conductor ${email}:`, error);
        failed++;
      }
    }

    return {
      message: `Proceso finalizado. Correos enviados: ${successful}, Fallidos: ${failed}. Conductores sin email ignorados: ${conductorExpirations.length - conductorsMap.size}`,
      successful,
      failed,
    };
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
      propietario: 'Propietario',
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

  async notifyChecklistMissingItems(
    viajeId: number,
    tipo: string,
    itemsFaltantes: { nombre: string; seccion: string }[],
  ): Promise<{ message: string; count: number }> {
    const admins = await this.notificacionRepository.findUsersByRole('admin');
    const adminEmails = admins.map((u) => u.email).filter((e) => e);

    if (adminEmails.length === 0 || itemsFaltantes.length === 0) {
      return { message: 'No se enviaron notificaciones', count: 0 };
    }

    let htmlContent = `
      <h2>Alerta de Checklist Incompleto</h2>
      <p>Se ha registrado un checklist de <strong>${tipo.toUpperCase()}</strong> para el Viaje #${viajeId} con items faltantes.</p>
      <p>Los siguientes documentos/items no fueron marcados como completados:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Sección</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Item Faltante</th>
          </tr>
        </thead>
        <tbody>
    `;

    itemsFaltantes.forEach((item) => {
      htmlContent += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.seccion}</td>
          <td style="padding: 8px; border: 1px solid #ddd; color: #dc3545; font-weight: bold;">${item.nombre}</td>
        </tr>
      `;
    });

    htmlContent += `
        </tbody>
      </table>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">Sistema de Gestión de Transporte</p>
    `;

    let successful = 0;
    for (const email of adminEmails) {
      try {
        await this.sendEmail({
          to: email,
          subject: `[ALERTA] Checklist Incompleto - Viaje #${viajeId} (${tipo})`,
          text: `El checklist de ${tipo} del viaje #${viajeId} tiene ${itemsFaltantes.length} items faltantes.`,
          html: htmlContent,
        });
        successful++;
      } catch (e) {
        console.error(`Error sending checklist alert to admin ${email}`, e);
      }
    }

    return {
      message: `Notificación enviada a ${successful}/${adminEmails.length} administradores.`,
      count: itemsFaltantes.length,
    };
  }
}
