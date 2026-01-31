import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { dbConfig } from '@db/config.db';

import { vehiculos } from '@db/tables/vehiculo.table';
import { conductores } from '@db/tables/conductor.table';
import { mantenimientos } from '@db/tables/mantenimiento.table';
import { rutas } from '@db/tables/ruta.table';
import { viajes } from '@db/tables/viaje.table';
import { usuarios } from '@db/tables/usuario.table';
import { clientes } from '@db/tables/cliente.table';
import { conductorDocumentos } from '@db/tables/conductor-documento.table';
import { usuarioDocumentos } from '@db/tables/usuario-documento.table';
import { clienteDocumentos } from '@db/tables/cliente-documento.table';
import { vehiculoDocumentos } from '@db/tables/vehiculo-documento.table';
import { viajeConductores } from '@db/tables/viaje-conductor.table';
import { viajeVehiculos } from '@db/tables/viaje-vehiculo.table';
import { viajeComentarios } from '@db/tables/viaje-comentario.table';

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
