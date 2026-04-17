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

    let httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let finalMessage: any = 'Internal server error';

    if (exception instanceof HttpException) {
      finalMessage = exception.getResponse();
    } else if (typeof exception === 'object' && exception !== null) {
      const err = exception as any;
      const dbError = err.cause || err; // Drizzle guarda el error de Postgres en cause

      if (dbError && dbError.code) {
        // Map common PostgreSQL error codes to HTTP status codes
        const pgCodeToStatus: Record<string, HttpStatus> = {
          '22P02': HttpStatus.BAD_REQUEST, // Invalid text representation
          '23505': HttpStatus.CONFLICT,    // Unique violation
          '23503': HttpStatus.CONFLICT,    // Foreign key violation
          '22001': HttpStatus.BAD_REQUEST, // String data right truncation
          '23502': HttpStatus.BAD_REQUEST, // Not null violation
        };

        if (pgCodeToStatus[dbError.code]) {
          httpStatus = pgCodeToStatus[dbError.code];
        }

        finalMessage = dbError.message || 'Database error';
        if (dbError.detail) {
          finalMessage += `. Detail: ${dbError.detail}`;
        }
      } else {
        finalMessage = err.message || finalMessage;
      }
    }

    const message = finalMessage;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      message: typeof message === 'object' ? (message as any).message : message,
    };

    const isUnhandledException = !(exception instanceof HttpException);

    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR || isUnhandledException) {
      this.logger.error(`Critical/Database Error: ${responseBody.path} - ${responseBody.message}`, (exception as Error).stack);

      // Enviar notificación a Microsoft Teams (Fire and Forget)
      this.teamsNotifierService
        .sendErrorNotification({
          path: responseBody.path,
          message: responseBody.message,
          stack: (exception as Error).stack,
          timestamp: responseBody.timestamp,
          headers: request.headers,
          payload: request.body,
        })
        .catch((err) => {
          this.logger.error('Error al enviar notificación a Teams', err.message);
        });
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
