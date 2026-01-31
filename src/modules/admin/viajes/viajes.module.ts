import { Module } from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { ViajesController } from './viajes.controller';
import { ViajeRepository } from '@repository/viaje.repository';
import { ViajeConductorRepository } from '@repository/viaje-conductor.repository';
import { ViajeVehiculoRepository } from '@repository/viaje-vehiculo.repository';
import { ViajeComentarioRepository } from '@repository/viaje-comentario.repository';
import { ViajeServicioRepository } from '@repository/viaje-servicio.repository';
import { RutaRepository } from '@repository/ruta.repository';
import { ClienteRepository } from '@repository/cliente.repository';

@Module({
  controllers: [ViajesController],
  providers: [
    ViajesService,
    ViajeRepository,
    ViajeConductorRepository,
    ViajeVehiculoRepository,
    ViajeComentarioRepository,
    ViajeServicioRepository,
    RutaRepository,
    ClienteRepository,
  ],
  exports: [ViajeServicioRepository],
})
export class ViajesModule {}
