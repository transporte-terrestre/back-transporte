import { Module } from '@nestjs/common';
import { TalleresService } from './talleres.service';
import { TalleresController } from './talleres.controller';
import { TallerRepository } from '@repository/taller.repository';
import { SucursalRepository } from '@repository/sucursal.repository';

@Module({
  controllers: [TalleresController],
  providers: [TalleresService, TallerRepository, SucursalRepository],
  exports: [TalleresService],
})
export class TalleresModule {}
