import { Module } from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { UsuariosController } from "./usuarios.controller";
import { UsuarioRepository } from "@repository/usuario.repository";

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuarioRepository],
  exports: [UsuariosService, UsuarioRepository],
})
export class UsuariosModule {}
