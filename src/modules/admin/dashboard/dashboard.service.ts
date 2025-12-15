import { Injectable } from "@nestjs/common";
import { VehiculoRepository } from "@repository/vehiculo.repository";
import { ConductorRepository } from "@repository/conductor.repository";
import { ClienteRepository } from "@repository/cliente.repository";
import { ViajeRepository } from "@repository/viaje.repository";
import { MantenimientoRepository } from "@repository/mantenimiento.repository";
import { RutaRepository } from "@repository/ruta.repository";
import { sql, count, eq, gte, lte, and, desc } from "drizzle-orm";
import { database } from "@db/connection.db";
import { vehiculos } from "@model/tables/vehiculo.model";
import { viajes } from "@model/tables/viaje.model";
import { mantenimientos } from "@model/tables/mantenimiento.model";
import { rutas } from "@model/tables/ruta.model";
import { conductores } from "@model/tables/conductor.model";
import { viajeConductores } from "@model/tables/viaje-conductor.model";
import { viajeVehiculos } from "@model/tables/viaje-vehiculo.model";
import { clientes } from "@model/tables/cliente.model";

@Injectable()
export class DashboardService {
  constructor(
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly conductorRepository: ConductorRepository,
    private readonly clienteRepository: ClienteRepository,
    private readonly viajeRepository: ViajeRepository,
    private readonly mantenimientoRepository: MantenimientoRepository,
    private readonly rutaRepository: RutaRepository
  ) {}

  async getStats() {
    // Usar count directo en lugar de findAll para optimizar
    const [{ total: totalVehiculos }] = await database
      .select({ total: count() })
      .from(vehiculos);

    const [{ total: totalConductores }] = await database
      .select({ total: count() })
      .from(conductores);

    const { total: totalClientes } =
      await this.clienteRepository.findAllPaginated(1, 1);

    // Calcular viajes de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const viajesHoy = await database
      .select({ count: count() })
      .from(viajes)
      .where(
        and(gte(viajes.fechaSalida, today), lte(viajes.fechaSalida, tomorrow))
      );

    // Calcular cambios porcentuales (simulados por ahora)
    return {
      totalVehiculos: Number(totalVehiculos),
      conductoresActivos: Number(totalConductores),
      viajesHoy: Number(viajesHoy[0]?.count || 0),
      totalClientes: totalClientes,
      cambioVehiculos: 12,
      cambioConductores: 5,
      cambioViajes: 18,
      cambioClientes: 8,
    };
  }

  async getVehiculosPorEstado() {
    const result = await database
      .select({
        estado: vehiculos.estado,
        cantidad: count(),
      })
      .from(vehiculos)
      .groupBy(vehiculos.estado);

    const total = result.reduce((sum, item) => sum + Number(item.cantidad), 0);

    const data = result.map((item) => ({
      estado: item.estado,
      cantidad: Number(item.cantidad),
      porcentaje: Math.round((Number(item.cantidad) / total) * 100),
    }));

    return { data };
  }

  async getViajesRecientes() {
    const result = await database
      .select({
        id: viajes.id,
        rutaId: viajes.rutaId,
        rutaOcasional: viajes.rutaOcasional,
        tipoRuta: viajes.tipoRuta,
        clienteId: viajes.clienteId,
        tripulantes: viajes.tripulantes,
        fechaSalida: viajes.fechaSalida,
        estado: viajes.estado,
      })
      .from(viajes)
      .orderBy(desc(viajes.fechaSalida))
      .limit(5);

    const data = await Promise.all(
      result.map(async (viaje) => {
        // Obtener ruta
        let rutaTexto = "Ruta desconocida";
        if (viaje.tipoRuta === "ocasional") {
          rutaTexto = viaje.rutaOcasional || "Ruta ocasional";
        } else if (viaje.rutaId) {
          const ruta = await database
            .select()
            .from(rutas)
            .where(eq(rutas.id, viaje.rutaId))
            .limit(1);
          if (ruta[0]) {
            rutaTexto = `${ruta[0].origen} - ${ruta[0].destino}`;
          }
        }

        // Obtener conductor principal
        const conductorPrincipal = await database
          .select({
            conductorId: viajeConductores.conductorId,
          })
          .from(viajeConductores)
          .where(
            and(
              eq(viajeConductores.viajeId, viaje.id),
              eq(viajeConductores.esPrincipal, true)
            )
          )
          .limit(1);

        let conductorTexto = "Sin asignar";
        if (conductorPrincipal[0]) {
          const conductor = await database
            .select()
            .from(conductores)
            .where(eq(conductores.id, conductorPrincipal[0].conductorId))
            .limit(1);
          if (conductor[0]) {
            conductorTexto = conductor[0].nombreCompleto;
          }
        }

        // Obtener vehículo principal
        const vehiculoPrincipal = await database
          .select({
            vehiculoId: viajeVehiculos.vehiculoId,
          })
          .from(viajeVehiculos)
          .where(
            and(
              eq(viajeVehiculos.viajeId, viaje.id),
              eq(viajeVehiculos.esPrincipal, true)
            )
          )
          .limit(1);

        let vehiculoTexto = "N/A";
        if (vehiculoPrincipal[0]) {
          const vehiculo = await database
            .select()
            .from(vehiculos)
            .where(eq(vehiculos.id, vehiculoPrincipal[0].vehiculoId))
            .limit(1);
          if (vehiculo[0]) {
            vehiculoTexto = vehiculo[0].placa;
          }
        }

        return {
          id: viaje.id,
          ruta: rutaTexto,
          conductor: conductorTexto,
          vehiculo: vehiculoTexto,
          estado: viaje.estado,
          fechaSalida: viaje.fechaSalida,
        };
      })
    );

    return { data };
  }

  async getMantenimientosProximos() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30);

    const result = await database
      .select({
        id: mantenimientos.id,
        vehiculoId: mantenimientos.vehiculoId,
        tipo: mantenimientos.tipo,
        fecha: mantenimientos.fechaIngreso,
        descripcion: mantenimientos.descripcion,
      })
      .from(mantenimientos)
      .where(
        and(
          gte(mantenimientos.fechaIngreso, today),
          lte(mantenimientos.fechaIngreso, futureDate)
        )
      )
      .orderBy(mantenimientos.fechaIngreso)
      .limit(4);

    const data = await Promise.all(
      result.map(async (mant) => {
        const vehiculo = await database
          .select()
          .from(vehiculos)
          .where(eq(vehiculos.id, mant.vehiculoId))
          .limit(1);

        const fechaMant = new Date(mant.fecha);
        const diffTime = fechaMant.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let prioridad = "baja";
        if (diffDays <= 3) prioridad = "alta";
        else if (diffDays <= 7) prioridad = "media";

        return {
          vehiculo: vehiculo[0]?.placa || "N/A",
          tipo: mant.tipo,
          fecha: mant.fecha,
          dias: diffDays,
          prioridad,
        };
      })
    );

    return { data };
  }

  async getRutasPopulares() {
    const result = await database
      .select({
        rutaId: viajes.rutaId,
        totalViajes: count(),
      })
      .from(viajes)
      .where(eq(viajes.tipoRuta, "fija"))
      .groupBy(viajes.rutaId)
      .orderBy(desc(count()))
      .limit(5);

    const maxViajes = result.length > 0 ? Number(result[0].totalViajes) : 1;

    const data = await Promise.all(
      result.map(async (item) => {
        const ruta = await database
          .select()
          .from(rutas)
          .where(eq(rutas.id, item.rutaId))
          .limit(1);

        const viajesCount = Number(item.totalViajes);

        return {
          nombre: ruta[0]
            ? `${ruta[0].origen} - ${ruta[0].destino}`
            : "Ruta desconocida",
          viajes: viajesCount,
          porcentaje: Math.round((viajesCount / maxViajes) * 100),
        };
      })
    );

    return { data };
  }

  async getIngresosMensuales() {
    const today = new Date();
    const meses = ["Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    // Por ahora retornamos datos simulados
    // En producción, aquí deberías calcular los ingresos reales desde una tabla de pagos/ingresos
    const data = meses.map((mes, index) => ({
      mes,
      monto: Math.floor(Math.random() * (65000 - 45000) + 45000),
    }));

    return { data };
  }
}
