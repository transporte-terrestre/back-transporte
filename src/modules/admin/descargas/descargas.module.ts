import { Module } from '@nestjs/common';
import { DescargasController } from './descargas.controller';
import { DescargasService } from './descargas.service';
import { DescargasRepository } from '../../../repositories/descargas.repository';

@Module({
  controllers: [DescargasController],
  providers: [DescargasService, DescargasRepository],
})
export class DescargasModule {}
