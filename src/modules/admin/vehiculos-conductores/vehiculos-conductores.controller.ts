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
import { VehiculosConductoresService } from "./vehiculos-conductores.service";
import { VehiculoConductorCreateDto } from "./dto/vehiculo-conductor-create.dto";
import { VehiculoConductorUpdateDto } from "./dto/vehiculo-conductor-update.dto";
import { VehiculoConductorResultDto } from "./dto/vehiculo-conductor-result.dto";
import { AuthGuard } from "@nestjs/passport";
import {
  VehiculoConductorPaginationQueryDto,
  PaginatedVehiculoConductorResultDto,
} from "./dto/vehiculo-conductor-paginated.dto";

@ApiTags("vehiculos-conductores")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("vehiculo-conductor")
export class VehiculosConductoresController {
  constructor(
    private readonly vehiculosConductoresService: VehiculosConductoresService
  ) {}

  @Get("find-all")
  @ApiOperation({ 
    summary: "Obtener asignaciones vehículo-conductor con paginación y filtros",
    description: "Filtra por rango de fechas de asignación.",
  })
  @ApiResponse({ status: 200, type: PaginatedVehiculoConductorResultDto })
  findAll(@Query() query: VehiculoConductorPaginationQueryDto) {
    return this.vehiculosConductoresService.findAllPaginated(
      query.page,
      query.limit,
      query.fechaInicio,
      query.fechaFin,
    );
  }

  @Get("find-one/:id")
  @ApiOperation({ summary: "Get a vehicle assignment by ID" })
  @ApiParam({ name: "id", type: "number", description: "Assignment ID" })
  @ApiResponse({ status: 200, type: VehiculoConductorResultDto })
  findOne(@Param("id") id: string) {
    return this.vehiculosConductoresService.findOne(+id);
  }

  @Post("create")
  @ApiOperation({ summary: "Create a new vehicle assignment" })
  @ApiResponse({ status: 200, type: VehiculoConductorResultDto })
  create(@Body() createVehiculoConductorDto: VehiculoConductorCreateDto) {
    return this.vehiculosConductoresService.create(createVehiculoConductorDto);
  }

  @Patch("update/:id")
  @ApiOperation({ summary: "Update a vehicle assignment" })
  @ApiParam({ name: "id", type: "number", description: "Assignment ID" })
  @ApiResponse({ status: 200, type: VehiculoConductorResultDto })
  update(
    @Param("id") id: string,
    @Body() updateVehiculoConductorDto: VehiculoConductorUpdateDto
  ) {
    return this.vehiculosConductoresService.update(
      +id,
      updateVehiculoConductorDto
    );
  }

  @Delete("delete/:id")
  @ApiOperation({ summary: "Delete a vehicle assignment" })
  @ApiParam({ name: "id", type: "number", description: "Assignment ID" })
  @ApiResponse({ status: 200, type: VehiculoConductorResultDto })
  remove(@Param("id") id: string) {
    return this.vehiculosConductoresService.delete(+id);
  }
}
