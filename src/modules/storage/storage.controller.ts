import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "@nestjs/passport";
import { StorageService } from "./storage.service";
import { StorageResultDto } from "./dto/storage-result.dto";

@ApiTags("storage")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @ApiOperation({ summary: "Subir un archivo (imagen, documento, video, etc.)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: { type: "object", properties: { file: { type: "string", format: "binary" } } } })
  @ApiResponse({ status: 200, type: StorageResultDto })
  @UseInterceptors(FileInterceptor("file"))
  upload(@UploadedFile() file: Express.Multer.File, @Query("folder") folder?: string) {
    return this.storageService.upload(file, folder);
  }

  @Delete(":publicId")
  @ApiOperation({ summary: "Eliminar un archivo" })
  delete(@Param("publicId") publicId: string) {
    return this.storageService.delete(publicId);
  }
}
