import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { DescargasService } from './descargas.service';
import { DescargarDocumentosDto } from './dto/descargar-documentos.dto';

@ApiTags('descargas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('descargas')
export class DescargasController {
  constructor(private readonly descargasService: DescargasService) {}

  @Post('zip')
  @ApiOperation({ summary: 'Descargar documentos masivamente en un archivo ZIP' })
  @ApiResponse({
    status: 200,
    description: 'Archivo ZIP con los documentos solicitados',
  })
  async descargarDocumentosZip(
    @Body() dto: DescargarDocumentosDto,
    @Res() res: Response
  ) {
    // Delegamos toda la lógica al servicio
    await this.descargasService.descargarDocumentosZip(dto, res);
  }
}
