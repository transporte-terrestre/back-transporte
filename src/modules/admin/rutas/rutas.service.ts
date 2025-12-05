import { Injectable } from "@nestjs/common";
import { RutaRepository } from "@repositories/ruta.repository";
import { RutaCreateDto } from "./dto/ruta-create.dto";
import { RutaUpdateDto } from "./dto/ruta-update.dto";

@Injectable()
export class RutasService {
  constructor(private readonly rutaRepository: RutaRepository) {}

  findAll() {
    return this.rutaRepository.findAll();
  }

  findOne(id: number) {
    return this.rutaRepository.findOne(id);
  }

  create(data: RutaCreateDto) {
    return this.rutaRepository.create(data);
  }

  update(id: number, data: RutaUpdateDto) {
    return this.rutaRepository.update(id, data);
  }

  delete(id: number) {
    return this.rutaRepository.delete(id);
  }
}
