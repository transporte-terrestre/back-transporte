import { Module } from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { ViajesController } from './viajes.controller';
import { ViajeRepository } from '@repository/viaje.repository';
import { ViajeConductorRepository } from '@repository/viaje-conductor.repository';
import { ViajeVehiculoRepository } from '@repository/viaje-vehiculo.repository';
import { ViajeComentarioRepository } from '@repository/viaje-comentario.repository';
import { ViajeTramoRepository } from '@repository/viaje-tramo.repository';
import { ChecklistItemRepository } from '@repository/checklist-item.repository';
import { ViajeChecklistRepository } from '@repository/viaje-checklist.repository';
import { RutaRepository } from '@repository/ruta.repository';
import { ClienteRepository } from '@repository/cliente.repository';
import { ViajeCircuitoRepository } from '@repository/viaje-circuito.repository';
import { ViajePasajeroRepository } from '@repository/viaje-pasajero.repository';
import { VehiculoChecklistDocumentRepository } from '@repository/vehiculo-checklist-document.repository';
import { RutaParadaRepository } from '@repository/ruta-parada.repository';
import { PasajeroRepository } from '@repository/pasajero.repository';
import { VehiculoRepository } from '@repository/vehiculo.repository';
import { MantenimientoRepository } from '@repository/mantenimiento.repository';
import { ViajePasajeroMovimientoRepository } from '@repository/viaje-pasajero-movimiento.repository';
import { AlquilerRepository } from '@repository/alquiler.repository';
import { VehiculoDocumentoRepository } from '@repository/vehiculo-documento.repository';
import { ConductorDocumentoRepository } from '@repository/conductor-documento.repository';
import { ConductorRepository } from '@repository/conductor.repository';

import { GeminiAiModule } from '@module/gemini-ai/gemini-ai.module';

@Module({
  controllers: [ViajesController],
  providers: [
    ViajesService,
    ViajeRepository,
    ViajeConductorRepository,
    ViajeVehiculoRepository,
    ViajePasajeroRepository,
    PasajeroRepository,
    ViajeComentarioRepository,
    ViajeTramoRepository,
    ChecklistItemRepository,
    ViajeChecklistRepository,
    VehiculoChecklistDocumentRepository,
    RutaRepository,
    ClienteRepository,
    ViajeCircuitoRepository,
    RutaParadaRepository,
    VehiculoRepository,
    MantenimientoRepository,
    ViajePasajeroMovimientoRepository,
    AlquilerRepository,
    VehiculoDocumentoRepository,
    ConductorDocumentoRepository,
    ConductorRepository,
  ],
  imports: [GeminiAiModule],
  exports: [ViajeTramoRepository, ChecklistItemRepository, ViajeChecklistRepository],
})
export class ViajesModule {}
