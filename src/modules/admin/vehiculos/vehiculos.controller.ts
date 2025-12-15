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
import { VehiculosService } from "./vehiculos.service";
import { VehiculoCreateDto } from "./dto/vehiculo-create.dto";
import { VehiculoUpdateDto } from "./dto/vehiculo-update.dto";
import { VehiculoResultDto } from "./dto/vehiculo-result.dto";
import { AuthGuard } from "@nestjs/passport";
import {
  VehiculoPaginationQueryDto,
  PaginatedVehiculoResultDto,
} from "./dto/vehiculo-paginated.dto";
import { VehiculoDocumentoCreateDto } from "./dto/vehiculo-documento-create.dto";
import { VehiculoDocumentoUpdateDto } from "./dto/vehiculo-documento-update.dto";
import { VehiculoDocumentoResultDto } from "./dto/vehiculo-documento-result.dto";

@ApiTags("vehiculos")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("vehiculo")
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Get("find-all")
  @ApiOperation({ 
    summary: "Obtener vehículos con paginación, búsqueda y filtros",
  })
  @ApiResponse({ status: 200, type: PaginatedVehiculoResultDto })
  findAll(@Query() query: VehiculoPaginationQueryDto) {
    return this.vehiculosService.findAllPaginated(query.page, query.limit, query.search, query.fechaInicio, query.fechaFin);
  }

  @Get("find-one/:id")
  @ApiOperation({ summary: "Get a vehicle by ID" })
  @ApiParam({ name: "id", type: "number", description: "Vehicle ID" })
  @ApiResponse({ status: 200, type: VehiculoResultDto })
  findOne(@Param("id") id: string) {
    return this.vehiculosService.findOne(+id);
  }

  @Post("create")
  @ApiOperation({ summary: "Create a new vehicle" })
  @ApiResponse({ status: 200, type: VehiculoResultDto })
  create(@Body() createVehiculoDto: VehiculoCreateDto) {
    return this.vehiculosService.create(createVehiculoDto);
  }

  @Patch("update/:id")
  @ApiOperation({ summary: "Update a vehicle" })
  @ApiParam({ name: "id", type: "number", description: "Vehicle ID" })
  @ApiResponse({ status: 200, type: VehiculoResultDto })
  update(@Param("id") id: string, @Body() updateVehiculoDto: VehiculoUpdateDto) {
    return this.vehiculosService.update(+id, updateVehiculoDto);
  }

  @Delete("delete/:id")
  @ApiOperation({ summary: "Delete a vehicle" })
  @ApiParam({ name: "id", type: "number", description: "Vehicle ID" })
  @ApiResponse({ status: 200, type: VehiculoResultDto })
  remove(@Param("id") id: string) {
    return this.vehiculosService.delete(+id);
  }

  // ========== DOCUMENTOS ==========
  @Get("documento/:id")
  @ApiOperation({ summary: "Obtener un documento por ID" })
  @ApiParam({ name: "id", description: "ID del documento", type: Number })
  @ApiResponse({ status: 200, type: VehiculoDocumentoResultDto })
  findDocumento(@Param("id") id: string) {
    return this.vehiculosService.findDocumento(+id);
  }

  @Post("documento/create")
  @ApiOperation({ summary: "Crear un nuevo documento de vehículo" })
  @ApiResponse({ status: 201, type: VehiculoDocumentoResultDto })
  createDocumento(@Body() createDto: VehiculoDocumentoCreateDto) {
    return this.vehiculosService.createDocumento(createDto);
  }

  @Patch("documento/update/:id")
  @ApiOperation({ summary: "Actualizar un documento de vehículo" })
  @ApiParam({ name: "id", description: "ID del documento", type: Number })
  @ApiResponse({ status: 200, type: VehiculoDocumentoResultDto })
  updateDocumento(@Param("id") id: string, @Body() updateDto: VehiculoDocumentoUpdateDto) {
    return this.vehiculosService.updateDocumento(+id, updateDto);
  }

  @Delete("documento/delete/:id")
  @ApiOperation({ summary: "Eliminar un documento de vehículo" })
  @ApiParam({ name: "id", description: "ID del documento", type: Number })
  @ApiResponse({ status: 200, type: VehiculoDocumentoResultDto })
  deleteDocumento(@Param("id") id: string) {
    return this.vehiculosService.deleteDocumento(+id);
  }
}
