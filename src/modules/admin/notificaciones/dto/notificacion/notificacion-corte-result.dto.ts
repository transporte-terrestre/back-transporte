import { ApiProperty } from '@nestjs/swagger';

export class NotificacionCorteResultDto {
  @ApiProperty({ example: 'Notificaciones actualizadas correctamente' })
  message: string;

  @ApiProperty({ example: '2026-08-27T18:30:00.000Z', format: 'date-time' })
  fechaCorte: Date;
}
