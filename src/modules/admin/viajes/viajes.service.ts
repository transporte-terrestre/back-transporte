import { Injectable } from "@nestjs/common";
import { ViajeRepository } from "@repository/viaje.repository";
import { ViajeCreateDto } from "./dto/viaje-create.dto";
import { ViajeUpdateDto } from "./dto/viaje-update.dto";

@Injectable()
export class ViajesService {
  constructor(private readonly viajeRepository: ViajeRepository) {}

  findAll() {
    return this.viajeRepository.findAll();
  }

  findOne(id: number) {
    return this.viajeRepository.findOne(id);
  }

  create(data: ViajeCreateDto) {
    return this.viajeRepository.create(data);
  }

  update(id: number, data: ViajeUpdateDto) {
    return this.viajeRepository.update(id, data);
  }

  delete(id: number) {
    return this.viajeRepository.delete(id);
  }
}
