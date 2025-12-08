import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { dbConfig } from "@db/config.db";

import { vehiculos } from "@model/tables/vehiculo.model";
import { conductores } from "@model/tables/conductor.model";
import { vehiculosConductores } from "@model/tables/vehiculo-conductor.model";
import { mantenimientos } from "@model/tables/mantenimiento.model";
import { rutas } from "@model/tables/ruta.model";
import { viajes } from "@model/tables/viaje.model";

const pool = new Pool(dbConfig);

const schema = {
  vehiculos,
  conductores,
  vehiculosConductores,
  mantenimientos,
  rutas,
  viajes,
};

export const database = drizzle(pool, { schema: schema });
