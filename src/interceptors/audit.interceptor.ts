import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditoriaService } from '../modules/admin/auditoria/auditoria.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly auditoriaService: AuditoriaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl } = request;

    if (method === 'GET' || method === 'OPTIONS') {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const req = context.switchToHttp().getRequest();
        const { user, body } = req;

        // Ejecutamos la auditoría como "fire and forget"
        this.registrarAuditoria(method, originalUrl, body, user).catch((err) => {
          this.logger.error('Error al registrar auditoria', err);
        });
      }),
    );
  }

  private async registrarAuditoria(method: string, originalUrl: string, body: any, user: any) {
    // Usamos user.sub porque así viene en el JWT de este proyecto
    const usuarioId = user?.sub || user?.id;

    if (!usuarioId) {
      return;
    }

    let accion: 'CREAR' | 'EDITAR' | 'ELIMINAR';
    switch (method) {
      case 'POST':
        accion = 'CREAR';
        break;
      case 'PATCH':
      case 'PUT':
        accion = 'EDITAR';
        break;
      case 'DELETE':
        accion = 'ELIMINAR';
        break;
      default:
        return;
    }

    const detalle = body ? JSON.parse(JSON.stringify(body)) : {};
    if (detalle.contrasenia) detalle.contrasenia = '***';
    if (detalle.password) detalle.password = '***';

    const urlParts = originalUrl.split('?')[0].split('/').filter(Boolean);
    const modulo = urlParts.length > 0 ? urlParts.join('/') : 'general';

    await this.auditoriaService.registrarAccion({
      accion,
      usuarioId: usuarioId,
      modulo,
      detalle,
    });
  }
}
