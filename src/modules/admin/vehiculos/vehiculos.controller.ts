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
import { VehiculosService } from "./vehiculos.service";
import { VehiculoCreateDto } from "./dto/vehiculo-create.dto";
import { VehiculoUpdateDto } from "./dto/vehiculo-update.dto";
import { VehiculoResultDto } from "./dto/vehiculo-result.dto";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("vehiculos")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("vehiculo")
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Get("find-all")
  @ApiOperation({ summary: "Get all vehicles" })
  @ApiResponse({ status: 200, type: [VehiculoResultDto] })
  findAll() {
    return this.vehiculosService.findAll();
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
}
