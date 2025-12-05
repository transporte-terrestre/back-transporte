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
import { UsuariosService } from "./usuarios.service";
import { UsuarioCreateDto } from "./dto/usuario-create.dto";
import { UsuarioUpdateDto } from "./dto/usuario-update.dto";
import { UsuarioResultDto } from "./dto/usuario-result.dto";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("usuarios")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("usuario")
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get("find-all")
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, type: [UsuarioResultDto] })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get("find-one/:id")
  @ApiOperation({ summary: "Get a user by ID" })
  @ApiParam({ name: "id", type: "number", description: "User ID" })
  @ApiResponse({ status: 200, type: UsuarioResultDto })
  findOne(@Param("id") id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Post("create")
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({ status: 200, type: UsuarioResultDto })
  create(@Body() createUsuarioDto: UsuarioCreateDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Patch("update/:id")
  @ApiOperation({ summary: "Update a user" })
  @ApiParam({ name: "id", type: "number", description: "User ID" })
  @ApiResponse({ status: 200, type: UsuarioResultDto })
  update(@Param("id") id: string, @Body() updateUsuarioDto: UsuarioUpdateDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete("delete/:id")
  @ApiOperation({ summary: "Delete a user" })
  @ApiParam({ name: "id", type: "number", description: "User ID" })
  @ApiResponse({ status: 200, type: UsuarioResultDto })
  remove(@Param("id") id: string) {
    return this.usuariosService.remove(+id);
  }
}
