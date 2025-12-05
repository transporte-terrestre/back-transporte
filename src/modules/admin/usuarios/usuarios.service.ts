import { Injectable } from "@nestjs/common";
import { UsuarioCreateDto } from "./dto/usuario-create.dto";
import { UsuarioUpdateDto } from "./dto/usuario-update.dto";
import { UsuarioRepository } from "@repositories/usuario.repository";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsuariosService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async findAll() {
    return await this.usuarioRepository.findAll();
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
