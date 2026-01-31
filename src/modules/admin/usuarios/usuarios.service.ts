import { Injectable, BadRequestException } from '@nestjs/common';
import { UsuarioCreateDto } from './dto/usuario-create.dto';
import { UsuarioUpdateDto } from './dto/usuario-update.dto';
import { UsuarioRepository } from '@repository/usuario.repository';
import { UsuarioDocumentoRepository } from '@repository/usuario-documento.repository';
import { PaginatedUsuarioResultDto } from './dto/usuario-paginated.dto';
import { UsuarioDocumentoDTO, usuarioDocumentosTipo } from '@db/tables/usuario-documento.table';
import { DocumentosAgrupadosDto } from './dto/usuario-result.dto';
import { UsuarioDTO } from '@db/tables/usuario.table';
import * as bcrypt from 'bcrypt';

interface DatabaseError {
  code?: string;
  constraint?: string;
  cause?: DatabaseError;
}

@Injectable()
export class UsuariosService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly usuarioDocumentoRepository: UsuarioDocumentoRepository,
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    rol?: string,
  ): Promise<PaginatedUsuarioResultDto> {
    const { data, total } = await this.usuarioRepository.findAllPaginated(page, limit, { search, fechaInicio, fechaFin, rol });

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
    const usuario = await this.usuarioRepository.findOne(id);
    const documentos = await this.usuarioDocumentoRepository.findByUsuarioId(id);
    const documentosAgrupados = usuarioDocumentosTipo.enumValues.reduce((acc, tipo) => {
      acc[tipo] = documentos.filter((doc) => doc.tipo === tipo);
      return acc;
    }, {} as DocumentosAgrupadosDto);

    return {
      ...usuario,
      documentos: documentosAgrupados,
    };
  }

  async create(createUsuarioDto: UsuarioCreateDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUsuarioDto.contrasenia, 10);
      const nombreCompleto = `${createUsuarioDto.nombres} ${createUsuarioDto.apellidos}`;
      const usuario = await this.usuarioRepository.create({
        ...createUsuarioDto,
        contrasenia: hashedPassword,
        nombreCompleto,
      });

      // Retornar con documentos vacíos agrupados
      return {
        ...usuario,
        documentos: usuarioDocumentosTipo.enumValues.reduce((acc, tipo) => {
          acc[tipo] = [];
          return acc;
        }, {} as DocumentosAgrupadosDto),
      };
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      if (dbError.cause.code === '23505') {
        if (dbError.cause.constraint?.includes('email')) {
          throw new BadRequestException(['El correo electrónico ya está registrado']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async update(id: number, updateUsuarioDto: UsuarioUpdateDto) {
    try {
      const dataToUpdate: Partial<UsuarioDTO> = { ...updateUsuarioDto };

      if (dataToUpdate.contrasenia) {
        dataToUpdate.contrasenia = await bcrypt.hash(dataToUpdate.contrasenia, 10);
      }

      // Auto-generate nombreCompleto if nombres or apellidos are being updated
      if (updateUsuarioDto.nombres || updateUsuarioDto.apellidos) {
        const current = await this.usuarioRepository.findOne(id);
        const nombres = updateUsuarioDto.nombres ?? current.nombres;
        const apellidos = updateUsuarioDto.apellidos ?? current.apellidos;
        dataToUpdate.nombreCompleto = `${nombres} ${apellidos}`;
      }

      return await this.usuarioRepository.update(id, dataToUpdate);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      if (dbError.cause.code === '23505') {
        if (dbError.cause.constraint?.includes('email')) {
          throw new BadRequestException(['El correo electrónico ya está registrado']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async remove(id: number) {
    return await this.usuarioRepository.delete(id);
  }

  // ========== DOCUMENTOS ==========
  async findDocumento(id: number) {
    return await this.usuarioDocumentoRepository.findOne(id);
  }

  async createDocumento(data: Partial<UsuarioDocumentoDTO>) {
    return await this.usuarioDocumentoRepository.create(data as UsuarioDocumentoDTO);
  }

  async updateDocumento(id: number, data: Partial<UsuarioDocumentoDTO>) {
    return await this.usuarioDocumentoRepository.update(id, data);
  }

  async deleteDocumento(id: number) {
    return await this.usuarioDocumentoRepository.delete(id);
  }
}
