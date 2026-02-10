import { Injectable, BadRequestException } from '@nestjs/common';
import { ConductorRepository } from '@repository/conductor.repository';
import { ConductorDocumentoRepository } from '@repository/conductor-documento.repository';
import { ConductorCreateDto } from './dto/conductor/conductor-create.dto';
import { ConductorUpdateDto } from './dto/conductor/conductor-update.dto';
import { PaginatedConductorResultDto } from './dto/conductor/conductor-paginated.dto';
import { PaginatedConductorEstadoDocumentosResultDto, ConductorEstadoDocumentosDto, FiltroDocumentoEstado } from './dto/conductor/conductor-documentos-estado.dto';
import { ConductorDocumentoDTO, conductorDocumentosTipo } from '@db/tables/conductor-documento.table';
import { DocumentosAgrupadosConductorDto } from './dto/conductor/conductor-result.dto';
import { ConductorDTO } from '@db/tables/conductor.table';
import * as bcrypt from 'bcrypt';

interface DatabaseError {
  code?: string;
  constraint?: string;
  cause?: DatabaseError;
}

@Injectable()
export class ConductoresService {
  constructor(
    private readonly conductorRepository: ConductorRepository,
    private readonly conductorDocumentoRepository: ConductorDocumentoRepository,
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    claseLicencia?: string,
    categoriaLicencia?: string,
  ): Promise<PaginatedConductorResultDto> {
    const { data, total } = await this.conductorRepository.findAllPaginated(page, limit, {
      search,
      fechaInicio,
      fechaFin,
      claseLicencia,
      categoriaLicencia,
    });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async findAllEstadoDocumentos(
    page: number = 1,
    limit: number = 10,
    filtro: FiltroDocumentoEstado = FiltroDocumentoEstado.INCOMPLETO,
  ): Promise<PaginatedConductorEstadoDocumentosResultDto> {
    const { conductores, documentosPorConductor, total } = await this.conductorRepository.findAllWithDocumentos(page, limit, filtro);
    const hoy = new Date();

    const data: ConductorEstadoDocumentosDto[] = conductores.map((conductor) => {
      const documentos = documentosPorConductor[conductor.id] || [];
      
      const calcularEstado = (tipoDocumento: string): string => {
        const documento = documentos.find((doc) => doc.tipo === tipoDocumento);
        if (!documento) {
          return 'nulo';
        } else if (documento.fechaExpiracion) {
          const fechaExp = new Date(documento.fechaExpiracion);
          return fechaExp <= hoy ? 'caducado' : 'activo';
        } else {
          return 'activo';
        }
      };

      return {
        id: conductor.id,
        nombres: conductor.nombres,
        apellidos: conductor.apellidos,
        fotocheck: conductor.fotocheck ?? [],
        dni: calcularEstado('dni'),
        licencia_mtc: calcularEstado('licencia_mtc'),
        seguro_vida_ley: calcularEstado('seguro_vida_ley'),
        sctr: calcularEstado('sctr'),
        examen_medico: calcularEstado('examen_medico'),
        psicosensometrico: calcularEstado('psicosensometrico'),
        induccion_general: calcularEstado('induccion_general'),
        manejo_defensivo: calcularEstado('manejo_defensivo'),
        licencia_interna: calcularEstado('licencia_interna'),
        autoriza_ssgg: calcularEstado('autoriza_ssgg'),
        curso_seguridad_portuaria: calcularEstado('curso_seguridad_portuaria'),
        curso_mercancias_peligrosas: calcularEstado('curso_mercancias_peligrosas'),
        curso_basico_pbip: calcularEstado('curso_basico_pbip'),
        examen_medico_temporal: calcularEstado('examen_medico_temporal'),
        induccion_visita: calcularEstado('induccion_visita'),
        em_visita: calcularEstado('em_visita'),
        pase_conduc: calcularEstado('pase_conduc'),
        foto_funcionario: calcularEstado('foto_funcionario'),
      };
    });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async findOne(id: number) {
    const conductor = await this.conductorRepository.findOne(id);
    const documentos = await this.conductorDocumentoRepository.findByConductorId(id);

    // Agrupar documentos por tipo
    // Agrupar documentos por tipo de forma dinámica y tipada
    const documentosAgrupados = conductorDocumentosTipo.enumValues.reduce((acc, tipo) => {
      acc[tipo] = documentos.filter((doc) => doc.tipo === tipo);
      return acc;
    }, {} as DocumentosAgrupadosConductorDto);

    return {
      ...conductor,
      documentos: documentosAgrupados,
    };
  }

  async create(data: ConductorCreateDto) {
    try {
      const nombreCompleto = `${data.nombres} ${data.apellidos}`;
      const dataToCreate: Partial<ConductorDTO> = {
        ...data,
        nombreCompleto,
      };

      // Hashear la contraseña si se proporciona
      if (data.contrasenia) {
        dataToCreate.contrasenia = await bcrypt.hash(data.contrasenia, 10);
      }

      return await this.conductorRepository.create(dataToCreate as ConductorDTO);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      if (dbError.cause?.code === '23505') {
        if (dbError.cause.constraint?.includes('email')) {
          throw new BadRequestException(['El correo electrónico ya está registrado']);
        }
        if (dbError.cause.constraint?.includes('dni')) {
          throw new BadRequestException(['El DNI ya está registrado']);
        }
        if (dbError.cause.constraint?.includes('licencia')) {
          throw new BadRequestException(['El número de licencia ya está registrado']);
        }
        if (dbError.cause.constraint?.includes('celular')) {
          throw new BadRequestException(['El número de celular ya está registrado']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async update(id: number, data: ConductorUpdateDto) {
    try {
      const dataToUpdate: Partial<ConductorDTO> = { ...data };

      // Hashear la contraseña si se proporciona
      if (data.contrasenia) {
        dataToUpdate.contrasenia = await bcrypt.hash(data.contrasenia, 10);
      }

      // Auto-generate nombreCompleto if nombres or apellidos are being updated
      if (data.nombres || data.apellidos) {
        const current = await this.conductorRepository.findOne(id);
        const nombres = data.nombres ?? current.nombres;
        const apellidos = data.apellidos ?? current.apellidos;
        dataToUpdate.nombreCompleto = `${nombres} ${apellidos}`;
      }

      return await this.conductorRepository.update(id, dataToUpdate);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      if (dbError.cause?.code === '23505') {
        if (dbError.cause.constraint?.includes('email')) {
          throw new BadRequestException(['El correo electrónico ya está registrado']);
        }
        if (dbError.cause.constraint?.includes('dni')) {
          throw new BadRequestException(['El DNI ya está registrado']);
        }
        if (dbError.cause.constraint?.includes('licencia')) {
          throw new BadRequestException(['El número de licencia ya está registrado']);
        }
        if (dbError.cause.constraint?.includes('celular')) {
          throw new BadRequestException(['El número de celular ya está registrado']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  delete(id: number) {
    return this.conductorRepository.delete(id);
  }

  // ========== DOCUMENTOS ==========
  async findDocumento(id: number) {
    return await this.conductorDocumentoRepository.findOne(id);
  }

  async createDocumento(data: Partial<ConductorDocumentoDTO>) {
    return await this.conductorDocumentoRepository.create(data as ConductorDocumentoDTO);
  }

  async updateDocumento(id: number, data: Partial<ConductorDocumentoDTO>) {
    return await this.conductorDocumentoRepository.update(id, data);
  }

  async deleteDocumento(id: number) {
    return await this.conductorDocumentoRepository.delete(id);
  }
}
