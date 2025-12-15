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
import { ConductoresService } from "./conductores.service";
import { ConductorCreateDto } from "./dto/conductor-create.dto";
import { ConductorUpdateDto } from "./dto/conductor-update.dto";
import { ConductorResultDto } from "./dto/conductor-result.dto";
import { AuthGuard } from "@nestjs/passport";
import {
  ConductorPaginationQueryDto,
  PaginatedConductorResultDto,
} from "./dto/conductor-paginated.dto";
import { ConductorDocumentoCreateDto } from "./dto/conductor-documento-create.dto";
import { ConductorDocumentoUpdateDto } from "./dto/conductor-documento-update.dto";
import { ConductorDocumentoResultDto } from "./dto/conductor-documento-result.dto";

@ApiTags("conductores")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("conductor")
export class ConductoresController {
  constructor(private readonly conductoresService: ConductoresService) {}

  @Get("find-all")
  @ApiOperation({
    summary: "Obtener conductores con paginación, búsqueda y filtros",
    description:
      "Busca por nombre, DNI o número de licencia. Filtra por rango de fechas.",
  })
  @ApiResponse({ status: 200, type: PaginatedConductorResultDto })
  findAll(@Query() query: ConductorPaginationQueryDto) {
    return this.conductoresService.findAllPaginated(
      query.page,
      query.limit,
      query.search,
      query.fechaInicio,
      query.fechaFin,
      query.claseLicencia,
      query.categoriaLicencia
    );
  }

  @Get("find-one/:id")
  @ApiOperation({ summary: "Get a driver by ID" })
  @ApiParam({ name: "id", type: "number", description: "Driver ID" })
  @ApiResponse({ status: 200, type: ConductorResultDto })
  findOne(@Param("id") id: string) {
    return this.conductoresService.findOne(+id);
  }

  @Post("create")
  @ApiOperation({ summary: "Create a new driver" })
  @ApiResponse({ status: 200, type: ConductorResultDto })
  create(@Body() createConductorDto: ConductorCreateDto) {
    return this.conductoresService.create(createConductorDto);
  }

  @Patch("update/:id")
  @ApiOperation({ summary: "Update a driver" })
  @ApiParam({ name: "id", type: "number", description: "Driver ID" })
  @ApiResponse({ status: 200, type: ConductorResultDto })
  update(
    @Param("id") id: string,
    @Body() updateConductorDto: ConductorUpdateDto
  ) {
    return this.conductoresService.update(+id, updateConductorDto);
  }

  @Delete("delete/:id")
  @ApiOperation({ summary: "Delete a driver" })
  @ApiParam({ name: "id", type: "number", description: "Driver ID" })
  @ApiResponse({ status: 200, type: ConductorResultDto })
  remove(@Param("id") id: string) {
    return this.conductoresService.delete(+id);
  }

  // ========== DOCUMENTOS ==========
  @Get("documento/:id")
  @ApiOperation({ summary: "Obtener un documento por ID" })
  @ApiParam({ name: "id", description: "ID del documento", type: Number })
  @ApiResponse({ status: 200, type: ConductorDocumentoResultDto })
  findDocumento(@Param("id") id: string) {
    return this.conductoresService.findDocumento(+id);
  }

  @Post("documento/create")
  @ApiOperation({ summary: "Crear un nuevo documento de conductor" })
  @ApiResponse({ status: 201, type: ConductorDocumentoResultDto })
  createDocumento(@Body() createDto: ConductorDocumentoCreateDto) {
    return this.conductoresService.createDocumento(createDto);
  }

  @Patch("documento/update/:id")
  @ApiOperation({ summary: "Actualizar un documento de conductor" })
  @ApiParam({ name: "id", description: "ID del documento", type: Number })
  @ApiResponse({ status: 200, type: ConductorDocumentoResultDto })
  updateDocumento(
    @Param("id") id: string,
    @Body() updateDto: ConductorDocumentoUpdateDto
  ) {
    return this.conductoresService.updateDocumento(+id, updateDto);
  }

  @Delete("documento/delete/:id")
  @ApiOperation({ summary: "Eliminar un documento de conductor" })
  @ApiParam({ name: "id", description: "ID del documento", type: Number })
  @ApiResponse({ status: 200, type: ConductorDocumentoResultDto })
  deleteDocumento(@Param("id") id: string) {
    return this.conductoresService.deleteDocumento(+id);
  }
}
