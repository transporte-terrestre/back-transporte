import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Client } from 'pg';
import { dbConfig } from '@db/config.db';
import { MantenimientosService } from './mantenimientos.service';

@Injectable()
export class MantenimientosListenerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MantenimientosListenerService.name);
  private client: Client;

  constructor(private readonly mantenimientosService: MantenimientosService) {
    this.client = new Client(dbConfig);
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('Conectado a PostgreSQL para escucha en tiempo real');

      await this.client.query('LISTEN vehiculo_mantenimiento_channel');

      this.client.on('notification', async (msg) => {
        if (msg.channel === 'vehiculo_mantenimiento_channel' && msg.payload) {
          const vehiculoId = parseInt(msg.payload);
          this.logger.log(`Notificación recibida: Cambio en vehículo ${vehiculoId}. Verificando mantenimiento...`);
          
          try {
            await this.mantenimientosService.verificarYGenerarMantenimiento(vehiculoId);
          } catch (error) {
            this.logger.error(`Error procesando mantenimiento para vehículo ${vehiculoId}`, error);
          }
        }
      });

      this.client.on('error', (err) => {
        this.logger.error('Error en el cliente de base de datos (Realtime)', err);
        this.reconnect();
      });

    } catch (error) {
      this.logger.error('No se pudo establecer la conexión de escucha en tiempo real', error);
      this.reconnect();
    }
  }

  private async reconnect() {
    this.logger.log('Intentando reconectar listener de base de datos en 5 segundos...');
    setTimeout(() => this.onModuleInit(), 5000);
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.end();
    }
  }
}
