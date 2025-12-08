import { Injectable } from "@nestjs/common";
import { MantenimientoRepository } from "@repository/mantenimiento.repository";
import { MantenimientoCreateDto } from "./dto/mantenimiento-create.dto";
import { MantenimientoUpdateDto } from "./dto/mantenimiento-update.dto";

@Injectable()
export class MantenimientosService {
  constructor(private readonly mantenimientoRepository: MantenimientoRepository) {}

  findAll() {
    return this.mantenimientoRepository.findAll();
  }

  findOne(id: number) {
    return this.mantenimientoRepository.findOne(id);
  }

  create(data: MantenimientoCreateDto) {
    return this.mantenimientoRepository.create(data);
  }

  update(id: number, data: MantenimientoUpdateDto) {
    return this.mantenimientoRepository.update(id, data);
  }

  delete(id: number) {
    return this.mantenimientoRepository.delete(id);
  }
}
