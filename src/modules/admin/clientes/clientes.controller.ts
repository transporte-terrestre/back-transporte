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
import { ClientesService } from "./clientes.service";
import { ClienteCreateDto } from "./dto/cliente-create.dto";
import { ClienteUpdateDto } from "./dto/cliente-update.dto";
import { ClienteResultDto } from "./dto/cliente-result.dto";
import { AuthGuard } from "@nestjs/passport";
import {
  ClientePaginationQueryDto,
  PaginatedClienteResultDto,
} from "./dto/cliente-paginated.dto";

@ApiTags("clientes")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("cliente")
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get("find-all")
  @ApiOperation({ 
    summary: "Obtener clientes con paginación, búsqueda y filtros",
    description: "Busca por nombre, apellido, DNI, teléfono o email. Filtra por rango de fechas.",
  })
  @ApiResponse({ status: 200, type: PaginatedClienteResultDto })
  findAll(@Query() query: ClientePaginationQueryDto) {
    return this.clientesService.findAllPaginated(
      query.page,
      query.limit,
      query.search,
      query.fechaInicio,
      query.fechaFin,
    );
  }

  @Get("find-one/:id")
  @ApiOperation({ summary: "Obtener un cliente por ID" })
  @ApiParam({ name: "id", type: "number", description: "ID del cliente" })
  @ApiResponse({ status: 200, type: ClienteResultDto })
  findOne(@Param("id") id: string) {
    return this.clientesService.findOne(+id);
  }

  @Post("create")
  @ApiOperation({ summary: "Crear un nuevo cliente" })
  @ApiResponse({ status: 200, type: ClienteResultDto })
  create(@Body() createClienteDto: ClienteCreateDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Patch("update/:id")
  @ApiOperation({ summary: "Actualizar un cliente" })
  @ApiParam({ name: "id", type: "number", description: "ID del cliente" })
  @ApiResponse({ status: 200, type: ClienteResultDto })
  update(@Param("id") id: string, @Body() updateClienteDto: ClienteUpdateDto) {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete("delete/:id")
  @ApiOperation({ summary: "Eliminar un cliente" })
  @ApiParam({ name: "id", type: "number", description: "ID del cliente" })
  @ApiResponse({ status: 200, type: ClienteResultDto })
  remove(@Param("id") id: string) {
    return this.clientesService.remove(+id);
  }
}
