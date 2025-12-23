import { Injectable } from "@nestjs/common";
import { ReportesRepository } from "@repository/reportes.repository";

@Injectable()
export class ReportesService {
  constructor(private readonly reportesRepository: ReportesRepository) {}

  // ========== REPORTES DETALLADOS ==========

  async getViajesDetalladosPorVehiculo(
    vehiculoId: number,
    fechaInicio?: string,
    fechaFin?: string
  ) {
    const start = fechaInicio ? new Date(fechaInicio) : undefined;
    const end = fechaFin ? new Date(fechaFin) : undefined;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    return await this.reportesRepository.getViajesDetalladosPorVehiculo(
      vehiculoId,
      start,
      end
    );
  }

  async getViajesDetalladosPorConductor(
    conductorId: number,
    fechaInicio?: string,
    fechaFin?: string
  ) {
    const start = fechaInicio ? new Date(fechaInicio) : undefined;
    const end = fechaFin ? new Date(fechaFin) : undefined;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    return await this.reportesRepository.getViajesDetalladosPorConductor(
      conductorId,
      start,
      end
    );
  }

  async getViajesDetalladosPorCliente(
    clienteId: number,
    fechaInicio?: string,
    fechaFin?: string
  ) {
    const start = fechaInicio ? new Date(fechaInicio) : undefined;
    const end = fechaFin ? new Date(fechaFin) : undefined;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    return await this.reportesRepository.getViajesDetalladosPorCliente(
      clienteId,
      start,
      end
    );
  }

  async getMantenimientosDetalladosPorVehiculo(
    vehiculoId: number,
    fechaInicio?: string,
    fechaFin?: string
  ) {
    const start = fechaInicio ? new Date(fechaInicio) : undefined;
    const end = fechaFin ? new Date(fechaFin) : undefined;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    return await this.reportesRepository.getMantenimientosDetalladosPorVehiculo(
      vehiculoId,
      start,
      end
    );
  }

  async getMantenimientosDetalladosPorTaller(
    tallerId: number,
    fechaInicio?: string,
    fechaFin?: string
  ) {
    const start = fechaInicio ? new Date(fechaInicio) : undefined;
    const end = fechaFin ? new Date(fechaFin) : undefined;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    return await this.reportesRepository.getMantenimientosDetalladosPorTaller(
      tallerId,
      start,
      end
    );
  }
}
