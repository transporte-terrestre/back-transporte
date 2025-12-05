import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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

@ApiTags("rutas")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("ruta")
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Get("find-all")
  @ApiOperation({ summary: "Get all routes" })
  @ApiResponse({ status: 200, type: [RutaResultDto] })
  findAll() {
    return this.rutasService.findAll();
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
