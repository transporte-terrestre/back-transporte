import { Injectable } from '@nestjs/common';
import { ReportesRepository } from '@repository/reportes.repository';
import { ReporteConductorDto } from './dto/reporte-conductor.dto';

@Injectable()
export class ReportesService {
  constructor(private readonly reportesRepository: ReportesRepository) {}

  // ========== REPORTES DETALLADOS ==========

  async getViajesDetalladosPorVehiculo(vehiculoId: number, fechaInicio?: string, fechaFin?: string) {
    const start = fechaInicio ? new Date(fechaInicio) : undefined;
    const end = fechaFin ? new Date(fechaFin) : undefined;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    return await this.reportesRepository.getViajesDetalladosPorVehiculo(vehiculoId, start, end);
  }

  async getViajesDetalladosPorConductor(conductorId: number, fechaInicio?: string, fechaFin?: string) {
    const start = fechaInicio ? new Date(fechaInicio) : undefined;
    const end = fechaFin ? new Date(fechaFin) : undefined;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    return await this.reportesRepository.getViajesDetalladosPorConductor(conductorId, start, end);
  }

  async getViajesDetalladosPorCliente(clienteId: number, fechaInicio?: string, fechaFin?: string) {
    const start = fechaInicio ? new Date(fechaInicio) : undefined;
    const end = fechaFin ? new Date(fechaFin) : undefined;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    return await this.reportesRepository.getViajesDetalladosPorCliente(clienteId, start, end);
  }

  async getMantenimientosDetalladosPorVehiculo(vehiculoId: number, fechaInicio?: string, fechaFin?: string) {
    const start = fechaInicio ? new Date(fechaInicio) : undefined;
    const end = fechaFin ? new Date(fechaFin) : undefined;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    return await this.reportesRepository.getMantenimientosDetalladosPorVehiculo(vehiculoId, start, end);
  }

  async getMantenimientosDetalladosPorTaller(tallerId: number, fechaInicio?: string, fechaFin?: string) {
    const start = fechaInicio ? new Date(fechaInicio) : undefined;
    const end = fechaFin ? new Date(fechaFin) : undefined;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    return await this.reportesRepository.getMantenimientosDetalladosPorTaller(tallerId, start, end);
  }

  async getReporteConductores(): Promise<ReporteConductorDto[]> {
    const rawData = await this.reportesRepository.getReporteConductores();
    const map = new Map<number, ReporteConductorDto>();

    // Helper to format date as DD-MM-YYYY
    const fmt = (dateStr: string | null | undefined) => {
      if (!dateStr) return 'NA';
      const d = new Date(dateStr);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    rawData.forEach((row) => {
      if (!map.has(row.id)) {
        // Initialize default empty DTO
        map.set(row.id, {
          id: row.id,
          rucEmpresa: '2043893327', // Updated hardcoded value
          ost: '2.MAY.3298', // Hardcoded
          dni: row.dni,
          nombres: row.nombres,
          apellidos: row.apellidos,
          // Initialize formatted fields
          induccionAnexo4: 'NO',
          fecEmisionInduccion: 'NA',
          manejoDefensivoAaq: 'NO',
          fecVenceManejoDef: 'NA',
          sctr: 'NO',
          vencimientoSctr: 'NA',
          seguroVidaLey: 'NO',
          fecVenceSegVidaLey: 'NA',
          documentoIdentidad: 'NO',
          autorizaSsgg: 'NO',
          cursoSeguridadPortuaria: 'NO',
          fotoFuncionario: 'NO',
          cursoMercanciasPeligrosas: 'NO',
          cursoBasicoPbip: 'NO',
          fVencExamenMedicoTemporal: 'NA',
          fVenceExamenMedico: 'NA',
          venceExamenPsicosensometrico: 'NA',
          fechaInduccionTemporal: 'NA',
          venceInduccionVisita: 'NA',
          venceEmVisita: 'NA',
          fechaVencimientoLicencia: 'NA',
          paseconduc: 'NO',
        });
      }

      const dto = map.get(row.id)!;

      // Map documents
      if (row.documentoTipo) {
        const fecha = row.documentoFechaExpiracion;
        const fechaEmision = row.documentoFechaEmision;

        switch (row.documentoTipo) {
          case 'induccion_general':
            dto.induccionAnexo4 = 'SI';
            dto.fecEmisionInduccion = fechaEmision ? fmt(fechaEmision) : 'NA';
            break;
          case 'manejo_defensivo':
            dto.manejoDefensivoAaq = 'SI';
            dto.fecVenceManejoDef = fmt(fecha);
            break;
          case 'sctr':
            dto.sctr = 'SI';
            dto.vencimientoSctr = fmt(fecha);
            break;
          case 'seguro_vida_ley':
            dto.seguroVidaLey = 'SI';
            dto.fecVenceSegVidaLey = fmt(fecha);
            break;
          case 'dni':
            dto.documentoIdentidad = 'SI';
            break;
          case 'autoriza_ssgg':
            dto.autorizaSsgg = 'SI';
            break;
          case 'curso_seguridad_portuaria':
            dto.cursoSeguridadPortuaria = 'SI';
            break;
          case 'curso_mercancias_peligrosas':
            dto.cursoMercanciasPeligrosas = 'SI';
            break;
          case 'curso_basico_pbip':
            dto.cursoBasicoPbip = 'SI';
            break;
          case 'examen_medico_temporal':
            dto.fVencExamenMedicoTemporal = fmt(fecha);
            break;
          case 'examen_medico':
            dto.fVenceExamenMedico = fmt(fecha);
            break;
          case 'psicosensometrico':
            dto.venceExamenPsicosensometrico = fmt(fecha);
            break;
          case 'induccion_visita':
            dto.venceInduccionVisita = fmt(fecha);
            break;
          case 'em_visita':
            dto.venceEmVisita = fmt(fecha);
            break;
          case 'licencia_mtc':
            dto.fechaVencimientoLicencia = fmt(fecha);
            break;
          case 'pase_conduc':
            dto.paseconduc = 'SI';
            break;
          case 'foto_funcionario':
            dto.fotoFuncionario = 'SI';
            break;
        }
      }
    });

    return Array.from(map.values());
  }
}
