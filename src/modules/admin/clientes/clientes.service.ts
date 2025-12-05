import { Injectable } from "@nestjs/common";
import { ClienteCreateDto } from "./dto/cliente-create.dto";
import { ClienteUpdateDto } from "./dto/cliente-update.dto";
import { ClienteRepository } from "@repositories/cliente.repository";

@Injectable()
export class ClientesService {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async findAll() {
    return await this.clienteRepository.findAll();
  }

  async findOne(id: number) {
    return await this.clienteRepository.findOne(id);
  }

  async create(createClienteDto: ClienteCreateDto) {
    return await this.clienteRepository.create(createClienteDto);
  }

  async update(id: number, updateClienteDto: ClienteUpdateDto) {
    return await this.clienteRepository.update(id, updateClienteDto);
  }

  async remove(id: number) {
    return await this.clienteRepository.delete(id);
  }
}
