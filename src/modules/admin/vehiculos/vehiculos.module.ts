import { Module } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { VehiculosController } from './vehiculos.controller';
import { VehiculoRepository } from '@repository/vehiculo.repository';
import { VehiculoDocumentoRepository } from '@repository/vehiculo-documento.repository';
import { MarcaRepository } from '@repository/marca.repository';
import { ModeloRepository } from '@repository/modelo.repository';
import { VehiculoChecklistDocumentRepository } from '@repository/vehiculo-checklist-document.repository';
import { ChecklistItemRepository } from '@repository/checklist-item.repository';

@Module({
  controllers: [VehiculosController],
  providers: [
    VehiculosService,
    VehiculoRepository,
    VehiculoDocumentoRepository,
    MarcaRepository,
    ModeloRepository,
    VehiculoChecklistDocumentRepository,
    ChecklistItemRepository,
  ],
})
export class VehiculosModule {}
