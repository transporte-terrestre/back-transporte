import { Controller, Get, Post, Query, Param, UseGuards, ParseIntPipe, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionCreateDto } from './dto/notificacion/notificacion-create.dto';
import { PaginatedNotificacionResultDto, NotificacionPaginationQueryDto } from './dto/notificacion/notificacion-paginated.dto';
import { NotificacionResultDto } from './dto/notificacion/notificacion-result.dto';
import {
  PreviewVencimientosResultDto,
  GenerarVencimientosResultDto,
  NotificacionVencimientoQueryDto,
} from './dto/notificacion/notificacion-vencimiento.dto';
import { SendEmailDto } from './dto/email/send-email.dto';

@ApiTags('notificaciones')
@Controller('notificacion')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get('find-all')
  @ApiOperation({ summary: 'Obtener notificaciones del usuario' })
  @ApiResponse({ status: 200, type: PaginatedNotificacionResultDto })
  async findAll(@Query() query: NotificacionPaginationQueryDto) {
    return await this.notificacionesService.findAllByUser(query.userId, query.page, query.limit);
  }

  @Post('create')
  @ApiOperation({ summary: 'Crear una nueva notificación general' })
  @ApiResponse({ status: 201, type: NotificacionResultDto })
  async create(@Body() createDto: NotificacionCreateDto): Promise<NotificacionResultDto> {
    return await this.notificacionesService.create(createDto);
  }

  @Post('leido/:id')
  @ApiOperation({ summary: 'Marcar notificación como leída' })
  @ApiResponse({ status: 200, type: NotificacionResultDto })
  async markAsRead(@Param('id', ParseIntPipe) id: number, @Query('userId', ParseIntPipe) userId: number): Promise<NotificacionResultDto> {
    return await this.notificacionesService.markAsRead(userId, id);
  }

  @Get('vencimientos/test')
  @ApiOperation({ summary: 'TEST: Previsualizar notificaciones de documentos por vencer' })
  @ApiResponse({ status: 200, type: PreviewVencimientosResultDto })
  async previewVencimientos(@Query() query: NotificacionVencimientoQueryDto): Promise<PreviewVencimientosResultDto> {
    return await this.notificacionesService.previewNotificacionesVencimiento(query.fecha, query.diasAnticipacion);
  }

  @Post('vencimientos/generar')
  @ApiOperation({
    summary: 'Generar y guardar notificaciones de documentos por vencer',
    description: 'Busca documentos por vencer/vencidos y CREA las notificaciones en la base de datos.',
  })
  @ApiResponse({ status: 201, type: GenerarVencimientosResultDto })
  async generarVencimientos(@Query() query: NotificacionVencimientoQueryDto): Promise<GenerarVencimientosResultDto> {
    return await this.notificacionesService.generarNotificacionesVencimiento(query.fecha, query.diasAnticipacion);
  }

  // Email

  @Post('send-email')
  @ApiOperation({ summary: 'Enviar un correo electrónico' })
  @ApiResponse({ status: 200, description: 'Correo enviado correctamente' })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return await this.notificacionesService.sendEmail(sendEmailDto);
  }

  @Post('notify-each-admin')
  @ApiOperation({ summary: 'Enviar lista de conductores con documentos por vencer a todos los administradores' })
  @ApiResponse({ status: 200, description: 'Correos enviados con el reporte' })
  async notifyEachAdmin(@Query('diasAnticipacion') diasAnticipacion?: number) {
    return await this.notificacionesService.notifyEachAdmin(diasAnticipacion ? Number(diasAnticipacion) : 7);
  }

  @Post('notify-each-conductor')
  @ApiOperation({ summary: 'Enviar correo personalizado a cada conductor con sus documentos por vencer' })
  @ApiResponse({ status: 200, description: 'Proceso de notificación por correo finalizado' })
  async notifyEachConductor(@Query('diasAnticipacion') diasAnticipacion?: number) {
    return await this.notificacionesService.notifyEachConductor(diasAnticipacion ? Number(diasAnticipacion) : 7);
  }


}
