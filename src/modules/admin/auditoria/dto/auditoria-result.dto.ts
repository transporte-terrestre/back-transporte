import { ApiProperty } from '@nestjs/swagger';
import { auditoriaAccion } from '@db/tables/auditoria.table';
import type { AuditoriaAccion } from '@db/tables/auditoria.table';
import { usuariosRol } from '@db/tables/usuario.table';
import type { UsuarioRol } from '@db/tables/usuario.table';
import { PaginationMetaDto } from '../../../../common/dto/pagination-meta.dto';

export class AuditoriaResultDto {
  @ApiProperty({ example: 1, description: 'ID de la auditoría' })
  id: number;

  @ApiProperty({
    enum: auditoriaAccion.enumValues,
    example: auditoriaAccion.enumValues[0],
    description: 'Acción realizada',
  })
  accion: AuditoriaAccion;

  @ApiProperty({ example: 1, description: 'ID del usuario que realizó la acción', required: false })
  usuarioId: number;

  @ApiProperty({ example: 1, description: 'ID del conductor que realizó la acción', required: false })
  conductorId: number;

  @ApiProperty({ example: 'vehiculo', description: 'Módulo afectado' })
  modulo: string;

  @ApiProperty({ example: { placa: 'ABC-123' }, description: 'Detalle del cambio en JSON' })
  detalle: any;

  @ApiProperty({
    example: '2026-04-01T12:00:00.000Z',
    description: 'Fecha y hora de la acción',
  })
  fechaHora: Date;

  @ApiProperty({ example: 'Erick', description: 'Nombre de quien realizó la acción' })
  executorNombre: string;

  @ApiProperty({ example: 'Flores', description: 'Apellido de quien realizó la acción' })
  executorApellido: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Rol de quien realizó la acción',
  })
  executorRol: string;

  @ApiProperty({ example: 'erick@gmail.com', description: 'Correo de quien realizó la acción' })
  executorEmail: string;
}

export class PaginatedAuditoriaResultDto {
  @ApiProperty({
    description: 'Lista de registros de auditoría',
    type: [AuditoriaResultDto],
  })
  data: AuditoriaResultDto[];

  @ApiProperty({
    description: 'Metadatos de paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
