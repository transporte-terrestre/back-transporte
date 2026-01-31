import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { dbConfig } from '@db/config.db';

import { vehiculos } from '@db/tables/vehiculo.model';
import { conductores } from '@db/tables/conductor.model';
import { mantenimientos } from '@db/tables/mantenimiento.model';
import { rutas } from '@db/tables/ruta.model';
import { viajes } from '@db/tables/viaje.model';
import { usuarios } from '@db/tables/usuario.model';
import { clientes } from '@db/tables/cliente.model';
import { conductorDocumentos } from '@db/tables/conductor-documento.model';
import { usuarioDocumentos } from '@db/tables/usuario-documento.model';
import { clienteDocumentos } from '@db/tables/cliente-documento.model';
import { vehiculoDocumentos } from '@db/tables/vehiculo-documento.model';
import { viajeConductores } from '@db/tables/viaje-conductor.model';
import { viajeVehiculos } from '@db/tables/viaje-vehiculo.model';
import { viajeComentarios } from '@db/tables/viaje-comentario.model';

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
