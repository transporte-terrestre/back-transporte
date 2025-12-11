import { Injectable } from "@nestjs/common";
import { UsuarioCreateDto } from "./dto/usuario-create.dto";
import { UsuarioUpdateDto } from "./dto/usuario-update.dto";
import { UsuarioRepository } from "@repository/usuario.repository";
import { PaginatedUsuarioResultDto } from "./dto/usuario-paginated.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsuariosService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<PaginatedUsuarioResultDto> {
    const { data, total } = await this.usuarioRepository.findAllPaginated(
      page,
      limit,
      { search, fechaInicio, fechaFin },
    );

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
    return await this.usuarioRepository.findOne(id);
  }

  async create(createUsuarioDto: UsuarioCreateDto) {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.contrasenia, 10);
    return await this.usuarioRepository.create({
      ...createUsuarioDto,
      contrasenia: hashedPassword,
    });
  }

  async update(id: number, updateUsuarioDto: UsuarioUpdateDto) {
    if (updateUsuarioDto.contrasenia) {
      updateUsuarioDto.contrasenia = await bcrypt.hash(updateUsuarioDto.contrasenia, 10);
    }
    return await this.usuarioRepository.update(id, updateUsuarioDto);
  }

  async remove(id: number) {
    return await this.usuarioRepository.delete(id);
  }
}
