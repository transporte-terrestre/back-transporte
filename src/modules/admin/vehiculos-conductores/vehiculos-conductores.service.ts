import { Injectable } from "@nestjs/common";
import { VehiculoConductorRepository } from "@repositories/vehiculo-conductor.repository";
import { VehiculoConductorCreateDto } from "./dto/vehiculo-conductor-create.dto";
import { VehiculoConductorUpdateDto } from "./dto/vehiculo-conductor-update.dto";

@Injectable()
export class VehiculosConductoresService {
  constructor(
    private readonly vehiculoConductorRepository: VehiculoConductorRepository
  ) {}

  findAll() {
    return this.vehiculoConductorRepository.findAll();
  }

  findOne(id: number) {
    return this.vehiculoConductorRepository.findOne(id);
  }

  create(data: VehiculoConductorCreateDto) {
    return this.vehiculoConductorRepository.create(data);
  }

  update(id: number, data: VehiculoConductorUpdateDto) {
    return this.vehiculoConductorRepository.update(id, data);
  }

  delete(id: number) {
    return this.vehiculoConductorRepository.delete(id);
  }
}
