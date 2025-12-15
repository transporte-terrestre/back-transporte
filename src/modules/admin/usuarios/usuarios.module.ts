import { Module } from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { UsuariosController } from "./usuarios.controller";
import { UsuarioRepository } from "@repository/usuario.repository";
import { UsuarioDocumentoRepository } from "@repository/usuario-documento.repository";

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuarioRepository, UsuarioDocumentoRepository],
  exports: [UsuariosService, UsuarioRepository],
})
export class UsuariosModule {}
