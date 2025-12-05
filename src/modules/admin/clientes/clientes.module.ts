import { Module } from "@nestjs/common";
import { ClientesService } from "./clientes.service";
import { ClientesController } from "./clientes.controller";
import { ClienteRepository } from "@repositories/cliente.repository";

@Module({
  controllers: [ClientesController],
  providers: [ClientesService, ClienteRepository],
  exports: [ClientesService, ClienteRepository],
})
export class ClientesModule {}
