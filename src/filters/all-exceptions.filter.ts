import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { TeamsNotifierService } from '../services/teams-notifier.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly teamsNotifierService: TeamsNotifierService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException ? exception.getResponse() : (exception as Error).message || 'Internal server error';

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      message: typeof message === 'object' ? (message as any).message : message,
    };

    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Critical Error: ${responseBody.path} - ${responseBody.message}`, (exception as Error).stack);

      // Enviar notificación a Microsoft Teams (Fire and Forget)
      this.teamsNotifierService
        .sendErrorNotification({
          path: responseBody.path,
          message: responseBody.message,
          stack: (exception as Error).stack,
          timestamp: responseBody.timestamp,
        })
        .catch((err) => {
          this.logger.error('Error al enviar notificación a Teams', err.message);
        });
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
