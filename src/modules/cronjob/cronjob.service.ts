import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificacionesService } from '../admin/notificaciones/notificaciones.service';

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);
  private readonly keepAliveUrl = process.env.KEEP_ALIVE_URL || 'http://localhost:3000';

  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Cron('*/10 * * * *') // Cada 10 minutos
  handleKeepAlive() {
    const url = `${this.keepAliveUrl}/`;
    this.logger.log(`Ejecutando keep-alive request a: ${url}`);
    fetch(url).catch((error) => {
      this.logger.warn(`Error en keep-alive request: ${error.message}`);
    });
  }

  @Cron('0 0 21 * * *')
  async handleGenerarVencimientos() {
    this.logger.log('CRON: Iniciando generación de notificaciones de vencimiento');
    const today = new Date().toISOString().split('T')[0];
    try {
      const result = await this.notificacionesService.generarNotificacionesVencimiento(today, 7);
      this.logger.log(`CRON: Generar Vencimientos completado. ${result.message}`);
    } catch (error) {
      this.logger.error('CRON: Error generando vencimientos', error);
    }
  }

  @Cron('0 0 21 * * *')
  async handleNotifyAdmins() {
    this.logger.log('CRON: Iniciando notificación a administradores');
    try {
      const result = await this.notificacionesService.notifyEachAdmin(7);
      this.logger.log(`CRON: Notificar Admins completado. ${result.message}`);
    } catch (error) {
      this.logger.error('CRON: Error notificando admins', error);
    }
  }

  @Cron('0 0 21 * * *')
  async handleNotifyConductors() {
    this.logger.log('CRON: Iniciando notificación a conductores');
    try {
      const result = await this.notificacionesService.notifyEachConductor(7);
      this.logger.log(`CRON: Notificar Conductores completado. ${result.message}`);
    } catch (error) {
      this.logger.error('CRON: Error notificando conductores', error);
    }
  }
}
