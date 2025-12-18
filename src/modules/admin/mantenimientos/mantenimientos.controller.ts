import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { MantenimientosService } from "./mantenimientos.service";
import { MantenimientoCreateDto } from "./dto/mantenimiento-create.dto";
import { MantenimientoUpdateDto } from "./dto/mantenimiento-update.dto";
import { MantenimientoResultDto } from "./dto/mantenimiento-result.dto";
import { AuthGuard } from "@nestjs/passport";
import {
  MantenimientoPaginationQueryDto,
  PaginatedMantenimientoResultDto,
} from "./dto/mantenimiento-paginated.dto";

@ApiTags("mantenimientos")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("mantenimiento")
export class MantenimientosController {
  constructor(private readonly mantenimientosService: MantenimientosService) {}

  @Get("find-all")
  @ApiOperation({
    summary: "Obtener mantenimientos con paginación, búsqueda y filtros",
    description:
      "Busca por tipo, proveedor o descripción. Filtra por rango de fechas.",
  })
  @ApiResponse({ status: 200, type: PaginatedMantenimientoResultDto })
  findAll(@Query() query: MantenimientoPaginationQueryDto) {
    return this.mantenimientosService.findAllPaginated(
      query.page,
      query.limit,
      query.search,
      query.fechaInicio,
      query.fechaFin,
      query.tipo,
      query.estado
    );
  }

  @Get("find-one/:id")
  @ApiOperation({ summary: "Get a maintenance record by ID" })
  @ApiParam({ name: "id", type: "number", description: "Maintenance ID" })
  @ApiResponse({ status: 200, type: MantenimientoResultDto })
  findOne(@Param("id") id: string) {
    return this.mantenimientosService.findOne(+id);
  }

  @Post("create")
  @ApiOperation({ summary: "Create a new maintenance record" })
  @ApiResponse({ status: 200, type: MantenimientoResultDto })
  create(@Body() createMantenimientoDto: MantenimientoCreateDto) {
    return this.mantenimientosService.create(createMantenimientoDto);
  }

  @Patch("update/:id")
  @ApiOperation({ summary: "Update a maintenance record" })
  @ApiParam({ name: "id", type: "number", description: "Maintenance ID" })
  @ApiResponse({ status: 200, type: MantenimientoResultDto })
  update(
    @Param("id") id: string,
    @Body() updateMantenimientoDto: MantenimientoUpdateDto
  ) {
    return this.mantenimientosService.update(+id, updateMantenimientoDto);
  }

  @Delete("delete/:id")
  @ApiOperation({ summary: "Delete a maintenance record" })
  @ApiParam({ name: "id", type: "number", description: "Maintenance ID" })
  @ApiResponse({ status: 200, type: MantenimientoResultDto })
  remove(@Param("id") id: string) {
    return this.mantenimientosService.delete(+id);
  }

  // ========== TAREAS ==========
  @Post("create/tarea")
  @ApiOperation({ summary: "Add a task to a maintenance record" })
  createTarea(@Body() data: any) {
    return this.mantenimientosService.createTarea(data);
  }

  @Patch("update/:id/tarea/:tareaId")
  @ApiOperation({ summary: "Update a maintenance task" })
  updateTarea(
    @Param("id") id: string,
    @Param("tareaId") tareaId: string,
    @Body() data: any
  ) {
    return this.mantenimientosService.updateTarea(+tareaId, data);
  }

  @Delete("delete/:id/tarea/:tareaId")
  @ApiOperation({ summary: "Delete a maintenance task" })
  deleteTarea(@Param("id") id: string, @Param("tareaId") tareaId: string) {
    return this.mantenimientosService.deleteTarea(+tareaId);
  }

  // ========== DOCUMENTOS ==========
  @Post("create/documento")
  @ApiOperation({ summary: "Add a document to a maintenance record" })
  createDocumento(@Body() data: any) {
    return this.mantenimientosService.createDocumento(data);
  }

  @Patch("update/:id/documento/:docId")
  @ApiOperation({ summary: "Update a maintenance document" })
  updateDocumento(
    @Param("id") id: string,
    @Param("docId") docId: string,
    @Body() data: any
  ) {
    return this.mantenimientosService.updateDocumento(+docId, data);
  }

  @Delete("delete/:id/documento/:docId")
  @ApiOperation({ summary: "Delete a maintenance document" })
  deleteDocumento(@Param("id") id: string, @Param("docId") docId: string) {
    return this.mantenimientosService.deleteDocumento(+docId);
  }
}
