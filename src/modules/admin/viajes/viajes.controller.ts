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
import { ViajesService } from "./viajes.service";
import { ViajeCreateDto } from "./dto/viaje-create.dto";
import { ViajeUpdateDto } from "./dto/viaje-update.dto";
import { ViajeResultDto } from "./dto/viaje-result.dto";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("viajes")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("viaje")
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) {}

  @Get("find-all")
  @ApiOperation({ summary: "Get all trips" })
  @ApiResponse({ status: 200, type: [ViajeResultDto] })
  findAll() {
    return this.viajesService.findAll();
  }

  @Get("find-one/:id")
  @ApiOperation({ summary: "Get a trip by ID" })
  @ApiParam({ name: "id", type: "number", description: "Trip ID" })
  @ApiResponse({ status: 200, type: ViajeResultDto })
  findOne(@Param("id") id: string) {
    return this.viajesService.findOne(+id);
  }

  @Post("create")
  @ApiOperation({ summary: "Create a new trip" })
  @ApiResponse({ status: 200, type: ViajeResultDto })
  create(@Body() createViajeDto: ViajeCreateDto) {
    return this.viajesService.create(createViajeDto);
  }

  @Patch("update/:id")
  @ApiOperation({ summary: "Update a trip" })
  @ApiParam({ name: "id", type: "number", description: "Trip ID" })
  @ApiResponse({ status: 200, type: ViajeResultDto })
  update(@Param("id") id: string, @Body() updateViajeDto: ViajeUpdateDto) {
    return this.viajesService.update(+id, updateViajeDto);
  }

  @Delete("delete/:id")
  @ApiOperation({ summary: "Delete a trip" })
  @ApiParam({ name: "id", type: "number", description: "Trip ID" })
  @ApiResponse({ status: 200, type: ViajeResultDto })
  remove(@Param("id") id: string) {
    return this.viajesService.delete(+id);
  }
}
