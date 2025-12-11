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

@ApiTags("conductores")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("conductor")
export class ConductoresController {
  constructor(private readonly conductoresService: ConductoresService) {}

  @Get("find-all")
  @ApiOperation({ 
    summary: "Obtener conductores con paginación, búsqueda y filtros",
    description: "Busca por nombre, DNI o número de licencia. Filtra por rango de fechas.",
  })
  @ApiResponse({ status: 200, type: PaginatedConductorResultDto })
  findAll(@Query() query: ConductorPaginationQueryDto) {
    return this.conductoresService.findAllPaginated(
      query.page,
      query.limit,
      query.search,
      query.fechaInicio,
      query.fechaFin,
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
  update(@Param("id") id: string, @Body() updateConductorDto: ConductorUpdateDto) {
    return this.conductoresService.update(+id, updateConductorDto);
  }

  @Delete("delete/:id")
  @ApiOperation({ summary: "Delete a driver" })
  @ApiParam({ name: "id", type: "number", description: "Driver ID" })
  @ApiResponse({ status: 200, type: ConductorResultDto })
  remove(@Param("id") id: string) {
    return this.conductoresService.delete(+id);
  }
}
