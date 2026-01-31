import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificacionResultDto } from './notificacion-result.dto';

export class NotificacionPreviewDto {
  @ApiProperty({ example: 'DNI próximo a vencer' })
  titulo: string;

  @ApiProperty({ example: 'El documento DNI de Cliente Juan Pérez vencerá en 5 días' })
  mensaje: string;

  @ApiProperty({ enum: ['info', 'warning', 'error', 'success'], example: 'warning' })
  tipo: string;

  @ApiProperty({ enum: ['cliente', 'conductor', 'vehiculo', 'usuario'], example: 'cliente' })
  entidad: string;

  @ApiProperty({ example: 1 })
  entidadId: number;

  @ApiProperty({ example: 'Juan Pérez' })
  entidadNombre: string;

  @ApiProperty({ example: 'dni' })
  tipoDocumento: string;

  @ApiProperty({ example: 5 })
  diasRestantes: number;
}

export class VencimientoResumenDto {
  @ApiProperty({ example: 5 })
  clientes: number;

  @ApiProperty({ example: 3 })
  conductores: number;

  @ApiProperty({ example: 2 })
  vehiculos: number;

  @ApiProperty({ example: 1 })
  usuarios: number;

  @ApiProperty({ example: 2 })
  vencidos: number;

  @ApiProperty({ example: 9 })
  porVencer: number;
}

export class PreviewVencimientosResultDto {
  @ApiProperty({
    example: {
      fechaReferencia: '2025-12-18',
      diasAnticipacion: 7,
      fechaLimite: '2025-12-25',
    },
  })
  parametros: {
    fechaReferencia: string;
    diasAnticipacion: number;
    fechaLimite: string;
  };

  @ApiProperty({ example: 11 })
  totalDocumentosEncontrados: number;

  @ApiProperty({ type: VencimientoResumenDto })
  resumen: VencimientoResumenDto;

  @ApiProperty({ type: [NotificacionPreviewDto] })
  notificaciones: NotificacionPreviewDto[];
}

export class GenerarVencimientosResultDto {
  @ApiProperty({ example: 'Se crearon 5 notificaciones' })
  message: string;

  @ApiProperty({ example: 5 })
  created: number;

  @ApiProperty({ type: [NotificacionResultDto], required: false })
  notifications?: NotificacionResultDto[];

  @ApiProperty({ type: [NotificacionPreviewDto] })
  previews: NotificacionPreviewDto[];

  @ApiProperty({
    example: {
      fechaReferencia: '2025-12-18',
      diasAnticipacion: 7,
    },
  })
  parametros: {
    fechaReferencia: string;
    diasAnticipacion: number;
  };
}

export class NotificacionVencimientoQueryDto {
  @ApiProperty({
    description: 'Fecha de referencia (YYYY-MM-DD). Punto de partida para la búsqueda.',
    example: '2025-12-18',
    required: true,
  })
  @IsDateString()
  fecha: string;

  @ApiProperty({
    description: 'Días de anticipación a buscar (default: 7). Busca documentos que vencen hasta fecha + diasAnticipacion.',
    example: 7,
    default: 7,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  diasAnticipacion: number = 7;
}
