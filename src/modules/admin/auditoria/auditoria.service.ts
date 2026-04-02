import { Injectable } from '@nestjs/common';
import { AuditoriaRepository } from '@repository/auditoria.repository';
import { AuditoriaDTO } from '@db/tables/auditoria.table';
import { PaginatedAuditoriaResultDto } from './dto/auditoria-result.dto';

@Injectable()
export class AuditoriaService {
  constructor(private readonly auditoriaRepository: AuditoriaRepository) {}

  async registrarAccion(data: AuditoriaDTO) {
    // Para que en la DB se guarde el "wall-clock" de Perú y se vea tal cual en el front (UTC)
    const now = new Date();
    const peruTime = new Date(now.getTime() - 5 * 60 * 60 * 1000);

    return this.auditoriaRepository.insertar({
      ...data,
      fechaHora: peruTime,
    });
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
  ): Promise<PaginatedAuditoriaResultDto> {
    const { data, total } = await this.auditoriaRepository.findAllPaginated(page, limit, { search, fechaInicio, fechaFin });
    
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
    return this.auditoriaRepository.findOne(id);
  }
}
