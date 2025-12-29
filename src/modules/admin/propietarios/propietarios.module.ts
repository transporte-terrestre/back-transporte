import { Module } from '@nestjs/common';
import { PropietariosService } from './propietarios.service';
import { PropietariosController } from './propietarios.controller';
import { PropietarioRepository } from '@repository/propietario.repository';
import { PropietarioDocumentoRepository } from '@repository/propietario-documento.repository';

@Module({
  controllers: [PropietariosController],
  providers: [PropietariosService, PropietarioRepository, PropietarioDocumentoRepository],
  exports: [PropietariosService, PropietarioRepository],
})
export class PropietariosModule {}
