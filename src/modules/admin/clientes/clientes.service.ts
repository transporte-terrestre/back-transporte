import { Injectable, BadRequestException } from '@nestjs/common';
import { ClienteCreateDto } from './dto/cliente-create.dto';
import { ClienteUpdateDto } from './dto/cliente-update.dto';
import { ClienteRepository } from '@repository/cliente.repository';
import { ClienteDocumentoRepository } from '@repository/cliente-documento.repository';
import { PaginatedClienteResultDto } from './dto/cliente-paginated.dto';
import { ClienteDocumentoDTO, clienteDocumentosTipo } from '@db/tables/cliente-documento.model';
import { DocumentosAgrupadosClienteDto } from './dto/cliente-result.dto';
import { ClienteDTO } from '@db/tables/cliente.model';

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
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    tipoDocumento?: string,
  ): Promise<PaginatedClienteResultDto> {
    const { data, total } = await this.clienteRepository.findAllPaginated(page, limit, {
      search,
      fechaInicio,
      fechaFin,
      tipoDocumento,
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
      const nombreCompleto = `${createClienteDto.nombres} ${createClienteDto.apellidos}`;
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

      // Auto-generate nombreCompleto if nombres or apellidos are being updated
      if (updateClienteDto.nombres || updateClienteDto.apellidos) {
        const current = await this.clienteRepository.findOne(id);
        const nombres = updateClienteDto.nombres ?? current.nombres;
        const apellidos = updateClienteDto.apellidos ?? current.apellidos;
        dataToUpdate.nombreCompleto = `${nombres} ${apellidos}`;
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
}
