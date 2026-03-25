import { Injectable, BadRequestException } from '@nestjs/common';
import { ClienteCreateDto } from './dto/cliente/cliente-create.dto';
import { ClienteUpdateDto } from './dto/cliente/cliente-update.dto';
import { ClienteRepository } from '@repository/cliente.repository';
import { ClienteDocumentoRepository } from '@repository/cliente-documento.repository';
import { PaginatedClienteResultDto } from './dto/cliente/cliente-paginated.dto';
import { ClienteDocumentoDTO, clienteDocumentosTipo } from '@db/tables/cliente-documento.table';
import { DocumentosAgrupadosClienteDto } from './dto/cliente/cliente-result.dto';
import { ClienteDTO } from '@db/tables/cliente.table';
import { PasajeroRepository } from '@repository/pasajero.repository';
import { PasajeroCreateDto } from './dto/pasajero/pasajero-create.dto';
import { PasajeroUpdateDto } from './dto/pasajero/pasajero-update.dto';
import { PaginatedPasajeroResultDto } from './dto/pasajero/pasajero-paginated.dto';
import { EncargadoRepository } from '@repository/encargado.repository';
import { EncargadoCreateDto } from './dto/encargado/encargado-create.dto';
import { EncargadoUpdateDto } from './dto/encargado/encargado-update.dto';
import { PaginatedEncargadoResultDto } from './dto/encargado/encargado-paginated.dto';
import { EntidadRepository } from '@repository/entidad.repository';
import { EntidadCreateDto } from './dto/entidad/entidad-create.dto';
import { EntidadUpdateDto } from './dto/entidad/entidad-update.dto';
import { PaginatedEntidadResultDto } from './dto/entidad/entidad-paginated.dto';
import type { ClienteTipoDocumento, ClienteTipo } from '@db/tables/cliente.table';

interface DatabaseError {
  code?: string;
  constraint?: string;
  cause?: DatabaseError;
}

@Injectable()
export class ClientesService {
  constructor(
    private readonly clienteRepository: ClienteRepository,
    private readonly clienteDocumentoRepository: ClienteDocumentoRepository,
    private readonly pasajeroRepository: PasajeroRepository,
    private readonly encargadoRepository: EncargadoRepository,
    private readonly entidadRepository: EntidadRepository,
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    tipoDocumento?: ClienteTipoDocumento,
    tipo?: ClienteTipo,
  ): Promise<PaginatedClienteResultDto> {
    const { data, total } = await this.clienteRepository.findAllPaginated(page, limit, {
      search,
      fechaInicio,
      fechaFin,
      tipoDocumento,
      tipo,
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
    const cliente = await this.clienteRepository.findOne(id);
    const documentos = await this.clienteDocumentoRepository.findByClienteId(id);

    // Agrupar documentos por tipo de forma dinámica y tipada
    const documentosAgrupados = clienteDocumentosTipo.enumValues.reduce((acc, tipo) => {
      acc[tipo] = documentos.filter((doc) => doc.tipo === tipo);
      return acc;
    }, {} as DocumentosAgrupadosClienteDto);

    return {
      ...cliente,
      documentos: documentosAgrupados,
    };
  }

  async create(createClienteDto: ClienteCreateDto) {
    try {
      const nombreCompleto = createClienteDto.tipoDocumento === 'RUC'
        ? createClienteDto.razonSocial
        : `${createClienteDto.nombres || ''} ${createClienteDto.apellidos || ''}`.trim();

      return await this.clienteRepository.create({
        ...createClienteDto,
        nombreCompleto,
      });
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      if (dbError.cause.code === '23505') {
        if (dbError.cause.constraint?.includes('email')) {
          throw new BadRequestException(['El correo electrónico ya está registrado']);
        }
        if (dbError.cause.constraint?.includes('dni')) {
          throw new BadRequestException(['El DNI ya está registrado']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async update(id: number, updateClienteDto: ClienteUpdateDto) {
    try {
      const dataToUpdate: Partial<ClienteDTO> = { ...updateClienteDto };

      // Auto-generate nombreCompleto if names are being updated
      if (updateClienteDto.nombres || updateClienteDto.apellidos || updateClienteDto.razonSocial || updateClienteDto.tipoDocumento) {
        const current = await this.clienteRepository.findOne(id);
        const tipo = updateClienteDto.tipoDocumento ?? current.tipoDocumento;

        if (tipo === 'RUC') {
          dataToUpdate.nombreCompleto = updateClienteDto.razonSocial ?? current.razonSocial;
        } else {
          const nombres = updateClienteDto.nombres ?? current.nombres;
          const apellidos = updateClienteDto.apellidos ?? current.apellidos;
          dataToUpdate.nombreCompleto = `${nombres || ''} ${apellidos || ''}`.trim();
        }
      }

      return await this.clienteRepository.update(id, dataToUpdate);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      const pgError = dbError.cause || dbError;
      if (pgError.code === '23505') {
        if (pgError.constraint?.includes('email')) {
          throw new BadRequestException(['El correo electrónico ya está registrado']);
        }
        if (pgError.constraint?.includes('dni')) {
          throw new BadRequestException(['El DNI ya está registrado']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async remove(id: number) {
    return await this.clienteRepository.delete(id);
  }

  // ========== DOCUMENTOS ==========
  async findDocumento(id: number) {
    return await this.clienteDocumentoRepository.findOne(id);
  }

  async createDocumento(data: Partial<ClienteDocumentoDTO>) {
    return await this.clienteDocumentoRepository.create(data as ClienteDocumentoDTO);
  }

  async updateDocumento(id: number, data: Partial<ClienteDocumentoDTO>) {
    return await this.clienteDocumentoRepository.update(id, data);
  }

  async deleteDocumento(id: number) {
    return await this.clienteDocumentoRepository.delete(id);
  }

  // ========== PASAJEROS ==========

  async findAllPasajerosPaginated(page: number = 1, limit: number = 10, search?: string, clienteId?: number): Promise<PaginatedPasajeroResultDto> {
    const { data, total } = await this.pasajeroRepository.findAllPaginated(page, limit, {
      search,
      clienteId,
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

  async findPasajero(id: number) {
    return await this.pasajeroRepository.findOne(id);
  }

  async createPasajero(createPasajeroDto: PasajeroCreateDto) {
    try {
      return await this.pasajeroRepository.create(createPasajeroDto);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      const constraint = dbError.cause?.constraint || dbError.constraint;
      if (dbError.code === '23505' || dbError.cause?.code === '23505') {
        if (constraint?.includes('cliente_dni')) {
          throw new BadRequestException(['El pasajero con este DNI ya existe para este cliente']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async updatePasajero(id: number, updatePasajeroDto: PasajeroUpdateDto) {
    try {
      return await this.pasajeroRepository.update(id, updatePasajeroDto);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      const constraint = dbError.cause?.constraint || dbError.constraint;
      if (dbError.code === '23505' || dbError.cause?.code === '23505') {
        if (constraint?.includes('cliente_dni')) {
          throw new BadRequestException(['El pasajero con este DNI ya existe para este cliente']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async deletePasajero(id: number) {
    return await this.pasajeroRepository.delete(id);
  }

  // ========== ENCARGADOS ==========

  async findAllEncargadosPaginated(page: number = 1, limit: number = 10, search?: string, clienteId?: number): Promise<PaginatedEncargadoResultDto> {
    const { data, total } = await this.encargadoRepository.findAllPaginated(page, limit, {
      search,
      clienteId,
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

  async findEncargado(id: number) {
    return await this.encargadoRepository.findOne(id);
  }

  async createEncargado(createEncargadoDto: EncargadoCreateDto) {
    try {
      return await this.encargadoRepository.create(createEncargadoDto);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      const constraint = dbError.cause?.constraint || dbError.constraint;
      if (dbError.code === '23505' || dbError.cause?.code === '23505') {
        if (constraint?.includes('cliente_dni')) {
          throw new BadRequestException(['El encargado con este DNI ya existe para este cliente']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async updateEncargado(id: number, updateEncargadoDto: EncargadoUpdateDto) {
    try {
      return await this.encargadoRepository.update(id, updateEncargadoDto);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      const constraint = dbError.cause?.constraint || dbError.constraint;
      if (dbError.code === '23505' || dbError.cause?.code === '23505') {
        if (constraint?.includes('cliente_dni')) {
          throw new BadRequestException(['El encargado con este DNI ya existe para este cliente']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async deleteEncargado(id: number) {
    return await this.encargadoRepository.delete(id);
  }

  // ========== ENTIDADES ==========

  async findAllEntidadesPaginated(page: number = 1, limit: number = 10, search?: string, clienteId?: number): Promise<PaginatedEntidadResultDto> {
    const { data, total } = await this.entidadRepository.findAllPaginated(page, limit, {
      search,
      clienteId,
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

  async findEntidad(id: number) {
    return await this.entidadRepository.findOne(id);
  }

  async createEntidad(createEntidadDto: EntidadCreateDto) {
    try {
      return await this.entidadRepository.create(createEntidadDto);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      const constraint = dbError.cause?.constraint || dbError.constraint;
      if (dbError.code === '23505' || dbError.cause?.code === '23505') {
        if (constraint?.includes('cliente_nombre')) {
          throw new BadRequestException(['La entidad con este nombre ya existe para este cliente']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async updateEntidad(id: number, updateEntidadDto: EntidadUpdateDto) {
    try {
      return await this.entidadRepository.update(id, updateEntidadDto);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      const constraint = dbError.cause?.constraint || dbError.constraint;
      if (dbError.code === '23505' || dbError.cause?.code === '23505') {
        if (constraint?.includes('cliente_nombre')) {
          throw new BadRequestException(['La entidad con este nombre ya existe para este cliente']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async deleteEntidad(id: number) {
    return await this.entidadRepository.delete(id);
  }
}
