import { Injectable } from "@nestjs/common";
import { VehiculoRepository } from "@repository/vehiculo.repository";
import { VehiculoCreateDto } from "./dto/vehiculo-create.dto";
import { VehiculoUpdateDto } from "./dto/vehiculo-update.dto";

@Injectable()
export class VehiculosService {
  constructor(private readonly vehiculoRepository: VehiculoRepository) {}

  findAll() {
    return this.vehiculoRepository.findAll();
  }

  findOne(id: number) {
    return this.vehiculoRepository.findOne(id);
  }

  create(data: VehiculoCreateDto) {
    return this.vehiculoRepository.create(data);
  }

  update(id: number, data: VehiculoUpdateDto) {
    return this.vehiculoRepository.update(id, data);
  }

  delete(id: number) {
    return this.vehiculoRepository.delete(id);
  }
}
