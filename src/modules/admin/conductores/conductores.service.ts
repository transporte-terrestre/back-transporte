import { Injectable } from "@nestjs/common";
import { ConductorRepository } from "@repositories/conductor.repository";
import { ConductorCreateDto } from "./dto/conductor-create.dto";
import { ConductorUpdateDto } from "./dto/conductor-update.dto";

@Injectable()
export class ConductoresService {
  constructor(private readonly conductorRepository: ConductorRepository) {}

  findAll() {
    return this.conductorRepository.findAll();
  }

  findOne(id: number) {
    return this.conductorRepository.findOne(id);
  }

  create(data: ConductorCreateDto) {
    return this.conductorRepository.create(data);
  }

  update(id: number, data: ConductorUpdateDto) {
    return this.conductorRepository.update(id, data);
  }

  delete(id: number) {
    return this.conductorRepository.delete(id);
  }
}
