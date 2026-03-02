import { Module } from '@nestjs/common';
import { AlquileresController } from './alquileres.controller';
import { AlquileresService } from './alquileres.service';
import { AlquilerRepository } from '@repository/alquiler.repository';

@Module({
  controllers: [AlquileresController],
  providers: [AlquileresService, AlquilerRepository],
  exports: [AlquileresService],
})
export class AlquileresModule {}
