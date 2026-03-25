import { Controller, Post, Delete, Param, UseGuards, UseInterceptors, UploadedFile, Query, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { StorageService } from './storage.service';
import { StorageResultDto } from './dto/storage-result.dto';

@ApiTags('storage')
@ApiBearerAuth()
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Subir un archivo (imagen, documento, video, etc.)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiResponse({ status: 200, type: StorageResultDto })
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    return this.storageService.upload(file, folder);
  }

  @Delete(':publicId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Eliminar un archivo' })
  delete(@Param('publicId') publicId: string) {
    return this.storageService.delete(publicId);
  }

  @Get('download-file')
  @ApiOperation({ summary: 'Proxy para descargar/visualizar archivos de Azure (CORS-safe)' })
  download(@Query('path') path: string) {
    return this.storageService.download(path);
  }
}
