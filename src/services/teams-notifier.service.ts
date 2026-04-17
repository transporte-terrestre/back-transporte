import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TeamsNotifierService {
  private readonly logger = new Logger(TeamsNotifierService.name);

  async sendErrorNotification(errorDetails: {
    path: string;
    message: string;
    stack?: string;
    timestamp: string;
    headers?: any;
    payload?: any;
  }) {
    const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
    if (!webhookUrl) {
      this.logger.warn('TEAMS_WEBHOOK_URL no definida en el archivo .env');
      return;
    }

    const card = {
      type: 'message',
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.adaptive',
          content: {
            type: 'AdaptiveCard',
            body: [
              {
                type: 'TextBlock',
                size: 'Medium',
                weight: 'Bolder',
                text: '🚨 Alerta de Error 500 (Backend)',
                color: 'Attention',
              },
              {
                type: 'FactSet',
                facts: [
                  { title: 'Ruta:', value: errorDetails.path },
                  { title: 'Fecha:', value: errorDetails.timestamp },
                ],
              },
              { type: 'TextBlock', text: 'Headers:', weight: 'Bolder', separator: true },
              {
                type: 'TextBlock',
                text: errorDetails.headers ? JSON.stringify(errorDetails.headers).substring(0, 800) : 'N/A',
                wrap: true,
                fontType: 'Monospace',
                size: 'Small',
              },
              { type: 'TextBlock', text: 'Payload (Body):', weight: 'Bolder', separator: true },
              {
                type: 'TextBlock',
                text: errorDetails.payload && Object.keys(errorDetails.payload).length > 0 ? JSON.stringify(errorDetails.payload, null, 2).substring(0, 1000) : 'N/A',
                wrap: true,
                fontType: 'Monospace',
                size: 'Small',
              },
              { type: 'TextBlock', text: 'Stack Trace:', weight: 'Bolder', separator: true },
              {
                type: 'TextBlock',
                text: errorDetails.stack ? errorDetails.stack.substring(0, 3000) + (errorDetails.stack.length > 3000 ? '...' : '') : 'No stack trace',
                wrap: true,
                fontType: 'Monospace',
                size: 'Small',
              },
              { type: 'TextBlock', text: 'Error Message:', weight: 'Bolder', separator: true, color: 'Attention' },
              {
                type: 'TextBlock',
                text: errorDetails.message,
                wrap: true,
              },
            ],
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            version: '1.4',
          },
        },
      ],
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card),
      });

      if (!response.ok) {
        throw new Error(`Teams API respondió con status ${response.status}`);
      }
    } catch (err) {
      this.logger.error('Falla al enviar notificación a Teams', err.stack);
    }
  }
}
