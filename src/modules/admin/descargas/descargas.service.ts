import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DescargarDocumentosDto } from './dto/descargar-documentos.dto';
import { DescargasRepository } from '../../../repositories/descargas.repository';
import { Response } from 'express';
import * as archiver from 'archiver';

@Injectable()
export class DescargasService {
  constructor(private readonly descargasRepository: DescargasRepository) {}

  async descargarDocumentosZip(dto: DescargarDocumentosDto, res: Response) {
    const filesToDownload: { url: string; folder: string; name: string }[] = [];

    // Procesar Vehículos
    if (dto.vehiculos && Object.keys(dto.vehiculos).length > 0) {
      for (const [vehiculoIdStr, tipos] of Object.entries(dto.vehiculos)) {
        const vehiculoId = parseInt(vehiculoIdStr, 10);
        if (isNaN(vehiculoId) || !tipos) continue;

        const { vehiculo, docs } = await this.descargasRepository.getVehiculoWithDocuments(vehiculoId, tipos);

        const folderName = vehiculo ? `Vehiculos/Vehiculo_${vehiculo.placa}` : `Vehiculos/Vehiculo_${vehiculoId}`;

        for (const doc of docs) {
          filesToDownload.push({
            url: doc.url,
            folder: folderName,
            name: `${doc.tipo}_${doc.nombre}`,
          });
        }
      }
    }

    // Procesar Conductores
    if (dto.conductores && Object.keys(dto.conductores).length > 0) {
      for (const [conductorIdStr, tipos] of Object.entries(dto.conductores)) {
        const conductorId = parseInt(conductorIdStr, 10);
        if (isNaN(conductorId) || !tipos) continue;

        const { conductor, docs } = await this.descargasRepository.getConductorWithDocuments(conductorId, tipos);

        const folderName = conductor
          ? `Conductores/Conductor_${conductor.nombres.replace(/\s+/g, '_')}_${conductor.apellidos.replace(/\s+/g, '_')}`
          : `Conductores/Conductor_${conductorId}`;

        for (const doc of docs) {
          filesToDownload.push({
            url: doc.url,
            folder: folderName,
            name: `${doc.tipo}_${doc.nombre}`,
          });
        }
      }
    }

    if (filesToDownload.length === 0) {
      throw new NotFoundException('No se encontraron documentos para descargar');
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="documentos.zip"');

    const archive = archiver.create('zip', {
      zlib: { level: 9 }, // Máxima compresión
    });

    archive.on('error', (err) => {
      console.error('Error al generar ZIP:', err);
      if (!res.headersSent) {
        throw new InternalServerErrorException('Error interno al generar el ZIP');
      }
    });

    archive.pipe(res);

    for (const file of filesToDownload) {
      try {
        const response = await fetch(file.url);
        if (!response.ok) {
          console.warn(`No se pudo descargar ${file.url}: ${response.statusText}`);
          continue;
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const extensionMatch = file.url.match(/\.([a-zA-Z0-9]+)(?:[\?#]|$)/);
        const extension = extensionMatch ? `.${extensionMatch[1]}` : '.pdf';

        let nameWithExt = file.name;
        if (!nameWithExt.endsWith(extension)) {
          nameWithExt += extension;
        }

        archive.append(buffer, { name: `${file.folder}/${nameWithExt}` });
      } catch (err) {
        console.error(`Error procesando archivo ${file.url}`, err);
      }
    }

    await archive.finalize();
  }
}
