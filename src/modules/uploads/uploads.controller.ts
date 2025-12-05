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
import { UploadsService } from "./uploads.service";
import { UploadResultDto } from "./dto/upload-result.dto";

@ApiTags("uploads")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("upload")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ApiOperation({ summary: "Subir un archivo (imagen, documento, video, etc.)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ schema: { type: "object", properties: { file: { type: "string", format: "binary" } } } })
  @ApiResponse({ status: 200, type: UploadResultDto })
  @UseInterceptors(FileInterceptor("file"))
  upload(@UploadedFile() file: Express.Multer.File, @Query("folder") folder?: string) {
    return this.uploadsService.upload(file, folder);
  }

  @Delete(":publicId")
  @ApiOperation({ summary: "Eliminar un archivo" })
  delete(@Param("publicId") publicId: string) {
    return this.uploadsService.delete(publicId);
  }
}
