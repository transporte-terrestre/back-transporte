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
import { RutasService } from "./rutas.service";
import { RutaCreateDto } from "./dto/ruta-create.dto";
import { RutaUpdateDto } from "./dto/ruta-update.dto";
import { RutaResultDto } from "./dto/ruta-result.dto";
import { AuthGuard } from "@nestjs/passport";
import {
  RutaPaginationQueryDto,
  PaginatedRutaResultDto,
} from "./dto/ruta-paginated.dto";

@ApiTags("rutas")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("ruta")
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Get("find-all")
  @ApiOperation({ 
    summary: "Obtener rutas con paginación, búsqueda y filtros",
    description: "Busca por origen o destino. Filtra por rango de fechas.",
  })
  @ApiResponse({ status: 200, type: PaginatedRutaResultDto })
  findAll(@Query() query: RutaPaginationQueryDto) {
    return this.rutasService.findAllPaginated(
      query.page,
      query.limit,
      query.search,
      query.fechaInicio,
      query.fechaFin,
    );
  }

  @Get("find-one/:id")
  @ApiOperation({ summary: "Get a route by ID" })
  @ApiParam({ name: "id", type: "number", description: "Route ID" })
  @ApiResponse({ status: 200, type: RutaResultDto })
  findOne(@Param("id") id: string) {
    return this.rutasService.findOne(+id);
  }

  @Post("create")
  @ApiOperation({ summary: "Create a new route" })
  @ApiResponse({ status: 200, type: RutaResultDto })
  create(@Body() createRutaDto: RutaCreateDto) {
    return this.rutasService.create(createRutaDto);
  }

  @Patch("update/:id")
  @ApiOperation({ summary: "Update a route" })
  @ApiParam({ name: "id", type: "number", description: "Route ID" })
  @ApiResponse({ status: 200, type: RutaResultDto })
  update(@Param("id") id: string, @Body() updateRutaDto: RutaUpdateDto) {
    return this.rutasService.update(+id, updateRutaDto);
  }

  @Delete("delete/:id")
  @ApiOperation({ summary: "Delete a route" })
  @ApiParam({ name: "id", type: "number", description: "Route ID" })
  @ApiResponse({ status: 200, type: RutaResultDto })
  remove(@Param("id") id: string) {
    return this.rutasService.delete(+id);
  }
}
