import { Injectable } from '@nestjs/common';
import { DashboardRepository } from '@repository/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getStats() {
    const totalVehiculos = await this.dashboardRepository.countVehiculos();
    const totalConductores = await this.dashboardRepository.countConductores();
    const totalClientes = await this.dashboardRepository.countClientes();
    const viajesHoy = await this.dashboardRepository.countViajesHoy();

    // Calcular cambios porcentuales (simulados por ahora)
    return {
      totalVehiculos,
      conductoresActivos: totalConductores,
      viajesHoy,
      totalClientes,
    };
  }

  async getVehiculosPorEstado() {
    const result = await this.dashboardRepository.getVehiculosPorEstado();
    const total = result.reduce((sum, item) => sum + Number(item.cantidad), 0);

    const data = result.map((item) => ({
      estado: item.estado,
      cantidad: Number(item.cantidad),
      porcentaje: Math.round((Number(item.cantidad) / total) * 100),
    }));

    return { data };
  }

  async getViajesRecientes() {
    const viajes = await this.dashboardRepository.getRecentTrips();

    const data = viajes.map((viaje) => {
      let rutaTexto = 'Ruta desconocida';
      if (viaje.tipoRuta === 'ocasional') {
        rutaTexto = viaje.rutaOcasional || 'Ruta ocasional';
      } else if (viaje.rutaDetails) {
        rutaTexto = `${viaje.rutaDetails.origen} - ${viaje.rutaDetails.destino}`;
      }

      const conductorTexto = viaje.conductorDetails?.nombreCompleto || 'Sin asignar';
      const vehiculoTexto = viaje.vehiculoDetails?.placa || 'N/A';

      return {
        id: viaje.id,
        ruta: rutaTexto,
        conductor: conductorTexto,
        vehiculo: vehiculoTexto,
        estado: viaje.estado,
        fechaSalida: viaje.fechaSalida,
      };
    });

    return { data };
  }

  async getMantenimientosProximos() {
    const mantenimientos = await this.dashboardRepository.getUpcomingMaintenances();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = mantenimientos.map((mant) => {
      const fechaMant = new Date(mant.fecha);
      const diffTime = fechaMant.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let prioridad = 'baja';
      if (diffDays <= 3) prioridad = 'alta';
      else if (diffDays <= 7) prioridad = 'media';

      return {
        vehiculo: mant.vehiculoDetails?.placa || 'N/A',
        tipo: mant.tipo,
        fecha: mant.fecha,
        dias: diffDays,
        prioridad,
        estado: mant.estado,
      };
    });

    return { data };
  }

  async getRutasPopulares() {
    const populares = await this.dashboardRepository.getRutasPopulares();
    const maxViajes = populares.length > 0 ? Number(populares[0].totalViajes) : 1;

    const data = populares.map((item) => {
      const viajesCount = Number(item.totalViajes);
      return {
        nombre: item.rutaDetails ? `${item.rutaDetails.origen} - ${item.rutaDetails.destino}` : 'Ruta desconocida',
        viajes: viajesCount,
        porcentaje: Math.round((viajesCount / maxViajes) * 100),
      };
    });

    return { data };
  }

  async getKilometrajeMensual() {
    const rawData = await this.dashboardRepository.getMonthlyKilometrage();

    // Map raw data for easy lookup
    const dataMap = new Map();
    rawData.forEach((item) => {
      const key = `${item.anio}-${item.mesNum}`;
      dataMap.set(key, item.monto);
    });

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const result = [];

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthIndex = date.getMonth();
      const monthNum = monthIndex + 1;
      const year = date.getFullYear();

      const key = `${year}-${monthNum}`;
      result.push({
        mes: monthNames[monthIndex],
        monto: dataMap.get(key) || 0,
      });
    }

    return { data: result };
  }
}
