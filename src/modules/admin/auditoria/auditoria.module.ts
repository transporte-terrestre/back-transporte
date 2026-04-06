import { Module } from '@nestjs/common';
import { AuditoriaController } from './auditoria.controller';
import { AuditoriaService } from './auditoria.service';
import { AuditoriaRepository } from '@repository/auditoria.repository';

@Module({
  controllers: [AuditoriaController],
  providers: [AuditoriaService, AuditoriaRepository],
  exports: [AuditoriaService], // Export so the global interceptor can use it
})
export class AuditoriaModule {}
