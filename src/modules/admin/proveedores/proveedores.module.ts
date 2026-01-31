import { Module } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';
import { ProveedorRepository } from '@repository/proveedor.repository';
import { ProveedorDocumentoRepository } from '@repository/proveedor-documento.repository';

@Module({
  controllers: [ProveedoresController],
  providers: [ProveedoresService, ProveedorRepository, ProveedorDocumentoRepository],
})
export class ProveedoresModule {}
