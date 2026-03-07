import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { ClienteRepository } from '@repository/cliente.repository';
import { ClienteDocumentoRepository } from '@repository/cliente-documento.repository';
import { PasajeroRepository } from '@repository/pasajero.repository';
import { EntidadRepository } from '@repository/entidad.repository';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService, ClienteRepository, ClienteDocumentoRepository, PasajeroRepository, EntidadRepository],
  exports: [ClientesService, ClienteRepository],
})
export class ClientesModule {}
