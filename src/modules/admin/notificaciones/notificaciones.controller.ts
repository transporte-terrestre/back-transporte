import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  UseGuards,
  ParseIntPipe,
  Body,
  DefaultValuePipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { NotificacionesService } from "./notificaciones.service";
import { NotificacionCreateDto } from "./dto/notificacion-create.dto";
import {
  PaginatedNotificacionResultDto,
  NotificacionPaginationQueryDto,
} from "./dto/notificacion-paginated.dto";

@ApiTags("Notificaciones")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("notificacion")
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get("find-all")
  @ApiOperation({ summary: "Obtener notificaciones del usuario" })
  @ApiResponse({ type: PaginatedNotificacionResultDto })
  async findAll(@Query() query: NotificacionPaginationQueryDto) {
    return await this.notificacionesService.findAllByUser(
      query.userId,
      query.page || 1,
      query.limit || 10
    );
  }

  @Post("create")
  @ApiOperation({ summary: "Crear una nueva notificación general" })
  async create(@Body() createDto: NotificacionCreateDto) {
    return await this.notificacionesService.create(createDto);
  }

  @Post("leido/:id")
  @ApiOperation({ summary: "Marcar notificación como leída" })
  async markAsRead(
    @Param("id", ParseIntPipe) id: number,
    @Query("userId", ParseIntPipe) userId: number
  ) {
    return await this.notificacionesService.markAsRead(userId, id);
  }

  // =============================================
  // DOCUMENT EXPIRATION ENDPOINTS
  // =============================================

  @Get("vencimientos/test")
  @ApiOperation({
    summary: "TEST: Previsualizar notificaciones de documentos por vencer",
    description:
      "Retorna una lista de posibles notificaciones para documentos que vencen dentro del período especificado. NO CREA las notificaciones.",
  })
  @ApiQuery({
    name: "fecha",
    required: true,
    description:
      "Fecha de referencia (YYYY-MM-DD). Punto de partida para la búsqueda.",
    example: "2025-12-18",
  })
  @ApiQuery({
    name: "diasAnticipacion",
    required: false,
    description:
      "Días de anticipación a buscar (default: 7). Busca documentos que vencen hasta fecha + diasAnticipacion.",
    example: 7,
  })
  async previewVencimientos(
    @Query("fecha") fecha: string,
    @Query("diasAnticipacion", new DefaultValuePipe(7), ParseIntPipe)
    diasAnticipacion: number
  ) {
    const fechaReferencia = new Date(fecha);

    if (isNaN(fechaReferencia.getTime())) {
      return {
        error: "Fecha inválida. Use formato YYYY-MM-DD",
        example: "2025-12-18",
      };
    }

    const fechaLimite = new Date(fechaReferencia);
    fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);

    const previews =
      await this.notificacionesService.previewNotificacionesVencimiento(
        fechaReferencia,
        diasAnticipacion
      );

    return {
      parametros: {
        fechaReferencia: fecha,
        diasAnticipacion,
        fechaLimite: fechaLimite.toISOString().split("T")[0],
      },
      totalDocumentosEncontrados: previews.length,
      resumen: {
        clientes: previews.filter((p) => p.entidad === "cliente").length,
        conductores: previews.filter((p) => p.entidad === "conductor").length,
        vehiculos: previews.filter((p) => p.entidad === "vehiculo").length,
        usuarios: previews.filter((p) => p.entidad === "usuario").length,
        vencidos: previews.filter((p) => p.diasRestantes < 0).length,
        porVencer: previews.filter((p) => p.diasRestantes >= 0).length,
      },
      notificaciones: previews,
    };
  }

  @Post("vencimientos/generar")
  @ApiOperation({
    summary: "Generar y guardar notificaciones de documentos por vencer",
    description:
      "Busca documentos por vencer/vencidos y CREA las notificaciones en la base de datos.",
  })
  @ApiQuery({
    name: "fecha",
    required: true,
    description:
      "Fecha de referencia (YYYY-MM-DD). Punto de partida para la búsqueda.",
    example: "2025-12-18",
  })
  @ApiQuery({
    name: "diasAnticipacion",
    required: false,
    description:
      "Días de anticipación a buscar (default: 7). Busca documentos que vencen hasta fecha + diasAnticipacion.",
    example: 7,
  })
  async generarVencimientos(
    @Query("fecha") fecha: string,
    @Query("diasAnticipacion", new DefaultValuePipe(7), ParseIntPipe)
    diasAnticipacion: number
  ) {
    const fechaReferencia = new Date(fecha);

    if (isNaN(fechaReferencia.getTime())) {
      return {
        error: "Fecha inválida. Use formato YYYY-MM-DD",
        example: "2025-12-18",
      };
    }

    const result =
      await this.notificacionesService.generarNotificacionesVencimiento(
        fechaReferencia,
        diasAnticipacion
      );

    return {
      ...result,
      parametros: {
        fechaReferencia: fecha,
        diasAnticipacion,
      },
    };
  }
}
