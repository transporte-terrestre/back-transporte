import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { VehiculosModule } from "./modules/admin/vehiculos/vehiculos.module";
import { ConductoresModule } from "./modules/admin/conductores/conductores.module";
import { VehiculosConductoresModule } from "./modules/admin/vehiculos-conductores/vehiculos-conductores.module";
import { MantenimientosModule } from "./modules/admin/mantenimientos/mantenimientos.module";
import { RutasModule } from "./modules/admin/rutas/rutas.module";
import { ViajesModule } from "./modules/admin/viajes/viajes.module";
import { UsuariosModule } from "./modules/admin/usuarios/usuarios.module";
import { ClientesModule } from "./modules/admin/clientes/clientes.module";
import { AuthModule } from "./modules/auth/auth.module";
import { StorageModule } from "./modules/storage/storage.module";

@Module({
  imports: [
    AuthModule,
    VehiculosModule,
    ConductoresModule,
    VehiculosConductoresModule,
    MantenimientosModule,
    RutasModule,
    ViajesModule,
    UsuariosModule,
    ClientesModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
