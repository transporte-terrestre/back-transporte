import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);
  private readonly keepAliveUrl = process.env.KEEP_ALIVE_URL || "http://localhost:3000";

  @Cron("*/3 * * * *") // Cada 3 minutos
  handleKeepAlive() {
    const url = `${this.keepAliveUrl}/`;
    
    this.logger.log(`Ejecutando keep-alive request a: ${url}`);
    
    // Hacer la solicitud sin esperar respuesta
    fetch(url).catch((error) => {
      this.logger.warn(`Error en keep-alive request: ${error.message}`);
    });
  }
}
