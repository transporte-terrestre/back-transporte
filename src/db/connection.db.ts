import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { dbConfig } from "@db/config.db";

import { vehiculos } from "@model/tables/vehiculo.model";
import { conductores } from "@model/tables/conductor.model";
import { mantenimientos } from "@model/tables/mantenimiento.model";
import { rutas } from "@model/tables/ruta.model";
import { viajes } from "@model/tables/viaje.model";
import { usuarios } from "@model/tables/usuario.model";
import { clientes } from "@model/tables/cliente.model";
import { conductorDocumentos } from "@model/tables/conductor-documento.model";
import { usuarioDocumentos } from "@model/tables/usuario-documento.model";
import { clienteDocumentos } from "@model/tables/cliente-documento.model";
import { vehiculoDocumentos } from "@model/tables/vehiculo-documento.model";
import { viajeConductores } from "@model/tables/viaje-conductor.model";
import { viajeVehiculos } from "@model/tables/viaje-vehiculo.model";
import { viajeComentarios } from "@model/tables/viaje-comentario.model";

const pool = new Pool(dbConfig);

const schema = {
  vehiculos,
  conductores,
  mantenimientos,
  rutas,
  viajes,
  usuarios,
  clientes,
  conductorDocumentos,
  usuarioDocumentos,
  clienteDocumentos,
  vehiculoDocumentos,
  viajeConductores,
  viajeVehiculos,
  viajeComentarios,
};

export const database = drizzle(pool, { schema: schema });
