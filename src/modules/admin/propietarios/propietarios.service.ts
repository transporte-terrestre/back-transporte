import { Injectable, BadRequestException } from '@nestjs/common';
import { PropietarioCreateDto } from './dto/propietario-create.dto';
import { PropietarioUpdateDto } from './dto/propietario-update.dto';
import { PropietarioRepository } from '@repository/propietario.repository';
import { PropietarioDocumentoRepository } from '@repository/propietario-documento.repository';
import { PaginatedPropietarioResultDto } from './dto/propietario-paginated.dto';
import { PropietarioDocumentoDTO, propietarioDocumentosTipo } from '@db/tables/propietario-documento.model';
import { DocumentosAgrupadosPropietarioDto } from './dto/propietario-result.dto';
import { PropietarioDTO } from '@db/tables/propietario.model';

interface DatabaseError {
  code?: string;
  constraint?: string;
  cause?: DatabaseError;
}

@Injectable()
export class PropietariosService {
  constructor(
    private readonly propietarioRepository: PropietarioRepository,
    private readonly propietarioDocumentoRepository: PropietarioDocumentoRepository,
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    tipoDocumento?: string,
  ): Promise<PaginatedPropietarioResultDto> {
    const { data, total } = await this.propietarioRepository.findAllPaginated(page, limit, {
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
    const propietario = await this.propietarioRepository.findOne(id);
    const documentos = await this.propietarioDocumentoRepository.findByPropietarioId(id);

    const documentosAgrupados = propietarioDocumentosTipo.enumValues.reduce((acc, tipo) => {
      acc[tipo] = documentos.filter((doc) => doc.tipo === tipo);
      return acc;
    }, {} as DocumentosAgrupadosPropietarioDto);

    return {
      ...propietario,
      documentos: documentosAgrupados,
    };
  }

  async create(createPropietarioDto: PropietarioCreateDto) {
    try {
      const nombreCompleto = createPropietarioDto.razonSocial || `${createPropietarioDto.nombres} ${createPropietarioDto.apellidos}`;
      return await this.propietarioRepository.create({
        ...createPropietarioDto,
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

  async update(id: number, updatePropietarioDto: PropietarioUpdateDto) {
    try {
      const dataToUpdate: Partial<PropietarioDTO> = { ...updatePropietarioDto };

      if (updatePropietarioDto.nombres || updatePropietarioDto.apellidos || updatePropietarioDto.razonSocial) {
        const current = await this.propietarioRepository.findOne(id);
        if (updatePropietarioDto.razonSocial) {
          dataToUpdate.nombreCompleto = updatePropietarioDto.razonSocial;
        } else {
          const nombres = updatePropietarioDto.nombres ?? current.nombres;
          const apellidos = updatePropietarioDto.apellidos ?? current.apellidos;
          dataToUpdate.nombreCompleto = `${nombres} ${apellidos}`;
        }
      }

      return await this.propietarioRepository.update(id, dataToUpdate);
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
    return await this.propietarioRepository.delete(id);
  }

  async findDocumento(id: number) {
    return await this.propietarioDocumentoRepository.findOne(id);
  }

  async createDocumento(data: Partial<PropietarioDocumentoDTO>) {
    return await this.propietarioDocumentoRepository.create(data as PropietarioDocumentoDTO);
  }

  async updateDocumento(id: number, data: Partial<PropietarioDocumentoDTO>) {
    return await this.propietarioDocumentoRepository.update(id, data);
  }

  async deleteDocumento(id: number) {
    return await this.propietarioDocumentoRepository.delete(id);
  }
}
