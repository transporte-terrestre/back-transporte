import { INestApplication } from '@nestjs/common';
import { AuditInterceptor } from '../interceptors/audit.interceptor';
import { AuditoriaService } from '../modules/admin/auditoria/auditoria.service';

export function setupGlobalInterceptors(app: INestApplication) {
  const auditoriaService = app.get(AuditoriaService);
  app.useGlobalInterceptors(new AuditInterceptor(auditoriaService));
}
