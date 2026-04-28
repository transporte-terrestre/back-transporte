import { Injectable } from '@nestjs/common';
import { database as db } from '@db/connection.db';
import { vehiculoDocumentos } from '@db/tables/vehiculo-documento.table';
import { conductorDocumentos } from '@db/tables/conductor-documento.table';
import { vehiculos } from '@db/tables/vehiculo.table';
import { conductores } from '@db/tables/conductor.table';
import { inArray, and, eq } from 'drizzle-orm';

@Injectable()
export class DescargasRepository {
  async getVehiculoWithDocuments(vehiculoId: number, tipos: string[]) {
    const vehiculo = await db.query.vehiculos.findFirst({
      where: eq(vehiculos.id, vehiculoId),
    });

    const docs = await db.query.vehiculoDocumentos.findMany({
      where: (!tipos || tipos.length === 0 || tipos.includes('*'))
        ? eq(vehiculoDocumentos.vehiculoId, vehiculoId)
        : and(
            eq(vehiculoDocumentos.vehiculoId, vehiculoId),
            inArray(vehiculoDocumentos.tipo, tipos as any[])
          ),
    });

    return { vehiculo, docs };
  }

  async getConductorWithDocuments(conductorId: number, tipos: string[]) {
    const conductor = await db.query.conductores.findFirst({
      where: eq(conductores.id, conductorId),
    });

    const docs = await db.query.conductorDocumentos.findMany({
      where: (!tipos || tipos.length === 0 || tipos.includes('*'))
        ? eq(conductorDocumentos.conductorId, conductorId)
        : and(
            eq(conductorDocumentos.conductorId, conductorId),
            inArray(conductorDocumentos.tipo, tipos as any[])
          ),
    });

    return { conductor, docs };
  }
}
