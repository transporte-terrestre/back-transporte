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

  @ApiProperty({ example: 1, description: 'ID del usuario que realizó la acción' })
  usuarioId: number;

  @ApiProperty({ example: 'vehiculo', description: 'Módulo afectado' })
  modulo: string;

  @ApiProperty({ example: { placa: 'ABC-123' }, description: 'Detalle del cambio en JSON' })
  detalle: any;

  @ApiProperty({
    example: '2026-04-01T12:00:00.000Z',
    description: 'Fecha y hora de la acción',
  })
  fechaHora: Date;

  @ApiProperty({ example: 'Erick', description: 'Nombre del usuario' })
  usuarioNombre: string;

  @ApiProperty({ example: 'Flores', description: 'Apellido del usuario' })
  usuarioApellido: string;

  @ApiProperty({
    enum: usuariosRol.enumValues,
    example: [usuariosRol.enumValues[0]],
    description: 'Roles del usuario',
    type: [String],
  })
  usuarioRol: UsuarioRol[];

  @ApiProperty({ example: 'erick@gmail.com', description: 'Correo del usuario' })
  usuarioEmail: string;
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
