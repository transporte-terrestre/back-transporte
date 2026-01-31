import { Injectable, BadRequestException } from '@nestjs/common';
import { ConductorRepository } from '@repository/conductor.repository';
import { ConductorDocumentoRepository } from '@repository/conductor-documento.repository';
import { ConductorCreateDto } from './dto/conductor-create.dto';
import { ConductorUpdateDto } from './dto/conductor-update.dto';
import { PaginatedConductorResultDto } from './dto/conductor-paginated.dto';
import { ConductorDocumentoDTO, conductorDocumentosTipo } from '@db/tables/conductor-documento.table';
import { DocumentosAgrupadosConductorDto } from './dto/conductor-result.dto';
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
