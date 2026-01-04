import { Injectable, BadRequestException } from '@nestjs/common';
import { ProveedorCreateDto } from './dto/proveedor-create.dto';
import { ProveedorUpdateDto } from './dto/proveedor-update.dto';
import { ProveedorRepository } from '@repository/proveedor.repository';
import { ProveedorDocumentoRepository } from '@repository/proveedor-documento.repository';
import { PaginatedProveedorResultDto } from './dto/proveedor-paginated.dto';
import { ProveedorDocumentoDTO } from '@model/tables/proveedor-documento.model';
import { ProveedorDTO } from '@model/tables/proveedor.model';

interface DatabaseError {
  code?: string;
  constraint?: string;
  cause?: DatabaseError;
}

@Injectable()
export class ProveedoresService {
  constructor(
    private readonly proveedorRepository: ProveedorRepository,
    private readonly proveedorDocumentoRepository: ProveedorDocumentoRepository,
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    tipoDocumento?: string,
  ): Promise<PaginatedProveedorResultDto> {
    const { data, total } = await this.proveedorRepository.findAllPaginated(page, limit, {
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
    const proveedor = await this.proveedorRepository.findOne(id);
    const documentos = await this.proveedorDocumentoRepository.findByProveedorId(id);

    return {
      ...proveedor,
      documentos,
    };
  }

  async create(createProveedorDto: ProveedorCreateDto) {
    try {
      const nombreCompleto = createProveedorDto.razonSocial || `${createProveedorDto.nombres} ${createProveedorDto.apellidos}`;
      return await this.proveedorRepository.create({
        ...createProveedorDto,
        nombreCompleto,
      });
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
        if (pgError.constraint?.includes('ruc')) {
          throw new BadRequestException(['El RUC ya está registrado']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async update(id: number, updateProveedorDto: ProveedorUpdateDto) {
    try {
      const dataToUpdate: Partial<ProveedorDTO> = { ...updateProveedorDto };

      if (updateProveedorDto.nombres || updateProveedorDto.apellidos || updateProveedorDto.razonSocial) {
        const current = await this.proveedorRepository.findOne(id);
        if (updateProveedorDto.razonSocial) {
          dataToUpdate.nombreCompleto = updateProveedorDto.razonSocial;
        } else {
          const nombres = updateProveedorDto.nombres ?? current.nombres;
          const apellidos = updateProveedorDto.apellidos ?? current.apellidos;
          dataToUpdate.nombreCompleto = `${nombres} ${apellidos}`;
        }
      }

      return await this.proveedorRepository.update(id, dataToUpdate);
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
        if (pgError.constraint?.includes('ruc')) {
          throw new BadRequestException(['El RUC ya está registrado']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async remove(id: number) {
    return await this.proveedorRepository.delete(id);
  }

  async findDocumento(id: number) {
    return await this.proveedorDocumentoRepository.findOne(id);
  }

  async createDocumento(data: Partial<ProveedorDocumentoDTO>) {
    return await this.proveedorDocumentoRepository.create(data as ProveedorDocumentoDTO);
  }

  async updateDocumento(id: number, data: Partial<ProveedorDocumentoDTO>) {
    return await this.proveedorDocumentoRepository.update(id, data);
  }

  async deleteDocumento(id: number) {
    return await this.proveedorDocumentoRepository.delete(id);
  }
}
