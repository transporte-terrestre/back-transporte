import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { dbConfig } from "@db/config.db";

import { vehiculos } from "@models/tables/vehiculo.model";
import { conductores } from "@models/tables/conductor.model";
import { vehiculosConductores } from "@models/tables/vehiculo-conductor.model";
import { mantenimientos } from "@models/tables/mantenimiento.model";
import { rutas } from "@models/tables/ruta.model";
import { viajes } from "@models/tables/viaje.model";

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
