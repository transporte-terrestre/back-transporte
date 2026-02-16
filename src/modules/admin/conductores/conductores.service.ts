import { Injectable, BadRequestException } from '@nestjs/common';
import { ConductorRepository } from '@repository/conductor.repository';
import { ConductorDocumentoRepository } from '@repository/conductor-documento.repository';
import { ConductorCreateDto } from './dto/conductor/conductor-create.dto';
import { ConductorUpdateDto } from './dto/conductor/conductor-update.dto';
import { PaginatedConductorResultDto } from './dto/conductor/conductor-paginated.dto';
import {
  PaginatedConductorEstadoDocumentosResultDto,
  ConductorEstadoDocumentosDto,
  FiltroDocumentoEstado,
} from './dto/conductor/conductor-documentos-estado.dto';
import { ConductorDocumentoDTO, conductorDocumentosTipo } from '@db/tables/conductor-documento.table';
import { DocumentosAgrupadosConductorDto } from './dto/conductor/conductor-result.dto';
import { ConductorDTO } from '@db/tables/conductor.table';
import * as bcrypt from 'bcrypt';
import archiver from 'archiver';
import { Readable } from 'stream';
import PDFDocument from 'pdfkit';

interface DatabaseError {
  code?: string;
  constraint?: string;
  cause?: DatabaseError;
}

@Injectable()
export class ConductoresService {
  constructor(
    private readonly conductorRepository: ConductorRepository,
    private readonly conductorDocumentoRepository: ConductorDocumentoRepository,
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    claseLicencia?: string,
    categoriaLicencia?: string,
  ): Promise<PaginatedConductorResultDto> {
    const { data, total } = await this.conductorRepository.findAllPaginated(page, limit, {
      search,
      fechaInicio,
      fechaFin,
      claseLicencia,
      categoriaLicencia,
    });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async findAllEstadoDocumentos(
    page: number = 1,
    limit: number = 10,
    filtro: FiltroDocumentoEstado = FiltroDocumentoEstado.INCOMPLETO,
  ): Promise<PaginatedConductorEstadoDocumentosResultDto> {
    const { conductores, documentosPorConductor, total } = await this.conductorRepository.findAllWithDocumentos(page, limit, filtro);
    const hoy = new Date();

    const data: ConductorEstadoDocumentosDto[] = conductores.map((conductor) => {
      const documentos = documentosPorConductor[conductor.id] || [];

      const calcularEstado = (tipoDocumento: string): string => {
        const documento = documentos.find((doc) => doc.tipo === tipoDocumento);
        if (!documento) {
          return 'nulo';
        } else if (documento.fechaExpiracion) {
          const fechaExp = new Date(documento.fechaExpiracion);
          return fechaExp <= hoy ? 'caducado' : 'activo';
        } else {
          return 'activo';
        }
      };

      return {
        id: conductor.id,
        nombres: conductor.nombres,
        apellidos: conductor.apellidos,
        fotocheck: conductor.fotocheck ?? [],
        dni: calcularEstado('dni'),
        licencia_mtc: calcularEstado('licencia_mtc'),
        seguro_vida_ley: calcularEstado('seguro_vida_ley'),
        sctr: calcularEstado('sctr'),
        examen_medico: calcularEstado('examen_medico'),
        psicosensometrico: calcularEstado('psicosensometrico'),
        induccion_general: calcularEstado('induccion_general'),
        manejo_defensivo: calcularEstado('manejo_defensivo'),
        licencia_interna: calcularEstado('licencia_interna'),
        autoriza_ssgg: calcularEstado('autoriza_ssgg'),
        curso_seguridad_portuaria: calcularEstado('curso_seguridad_portuaria'),
        curso_mercancias_peligrosas: calcularEstado('curso_mercancias_peligrosas'),
        curso_basico_pbip: calcularEstado('curso_basico_pbip'),
        examen_medico_temporal: calcularEstado('examen_medico_temporal'),
        induccion_visita: calcularEstado('induccion_visita'),
        em_visita: calcularEstado('em_visita'),
        pase_conduc: calcularEstado('pase_conduc'),
        foto_funcionario: calcularEstado('foto_funcionario'),
      };
    });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async findOne(id: number) {
    const conductor = await this.conductorRepository.findOne(id);
    const documentos = await this.conductorDocumentoRepository.findByConductorId(id);

    // Agrupar documentos por tipo
    // Agrupar documentos por tipo de forma dinámica y tipada
    const documentosAgrupados = conductorDocumentosTipo.enumValues.reduce((acc, tipo) => {
      acc[tipo] = documentos.filter((doc) => doc.tipo === tipo);
      return acc;
    }, {} as DocumentosAgrupadosConductorDto);

    return {
      ...conductor,
      documentos: documentosAgrupados,
    };
  }

  async create(data: ConductorCreateDto) {
    try {
      const nombreCompleto = `${data.nombres} ${data.apellidos}`;
      const dataToCreate: Partial<ConductorDTO> = {
        ...data,
        nombreCompleto,
      };

      // Hashear la contraseña si se proporciona
      if (data.contrasenia) {
        dataToCreate.contrasenia = await bcrypt.hash(data.contrasenia, 10);
      }

      return await this.conductorRepository.create(dataToCreate as ConductorDTO);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      if (dbError.cause?.code === '23505') {
        if (dbError.cause.constraint?.includes('email')) {
          throw new BadRequestException(['El correo electrónico ya está registrado']);
        }
        if (dbError.cause.constraint?.includes('dni')) {
          throw new BadRequestException(['El DNI ya está registrado']);
        }
        if (dbError.cause.constraint?.includes('licencia')) {
          throw new BadRequestException(['El número de licencia ya está registrado']);
        }
        if (dbError.cause.constraint?.includes('celular')) {
          throw new BadRequestException(['El número de celular ya está registrado']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  async update(id: number, data: ConductorUpdateDto) {
    try {
      const dataToUpdate: Partial<ConductorDTO> = { ...data };

      // Hashear la contraseña si se proporciona
      if (data.contrasenia) {
        dataToUpdate.contrasenia = await bcrypt.hash(data.contrasenia, 10);
      }

      // Auto-generate nombreCompleto if nombres or apellidos are being updated
      if (data.nombres || data.apellidos) {
        const current = await this.conductorRepository.findOne(id);
        const nombres = data.nombres ?? current.nombres;
        const apellidos = data.apellidos ?? current.apellidos;
        dataToUpdate.nombreCompleto = `${nombres} ${apellidos}`;
      }

      return await this.conductorRepository.update(id, dataToUpdate);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      if (dbError.cause?.code === '23505') {
        if (dbError.cause.constraint?.includes('email')) {
          throw new BadRequestException(['El correo electrónico ya está registrado']);
        }
        if (dbError.cause.constraint?.includes('dni')) {
          throw new BadRequestException(['El DNI ya está registrado']);
        }
        if (dbError.cause.constraint?.includes('licencia')) {
          throw new BadRequestException(['El número de licencia ya está registrado']);
        }
        if (dbError.cause.constraint?.includes('celular')) {
          throw new BadRequestException(['El número de celular ya está registrado']);
        }
        throw new BadRequestException(['Ya existe un registro con estos datos']);
      }
      throw error;
    }
  }

  delete(id: number) {
    return this.conductorRepository.delete(id);
  }

  // ========== DOCUMENTOS ==========
  async findDocumento(id: number) {
    return await this.conductorDocumentoRepository.findOne(id);
  }

  async createDocumento(data: Partial<ConductorDocumentoDTO>) {
    return await this.conductorDocumentoRepository.create(data as ConductorDocumentoDTO);
  }

  async updateDocumento(id: number, data: Partial<ConductorDocumentoDTO>) {
    return await this.conductorDocumentoRepository.update(id, data);
  }

  async deleteDocumento(id: number) {
    return await this.conductorDocumentoRepository.delete(id);
  }

  async downloadConductorFiles(id: number): Promise<{ stream: Readable; filename: string }> {
    const conductor = await this.findOne(id);
    const archive = archiver('zip', { zlib: { level: 9 } });
    const filename = `${conductor.nombres}_${conductor.apellidos}_documentos.zip`.replace(/\s+/g, '_');

    // PDF Generator
    const doc = new PDFDocument({ margin: 50 }); // Standard margins
    archive.append(doc as any, { name: 'ficha_conductor.pdf' });

    // --- STYLES ---
    const primaryColor = '#1a1a1a';
    const secondaryColor = '#4a4a4a';
    const accentColor = '#3b82f6'; // Blue-500 ish
    const boxBgColor = '#f3f4f6';

    // --- HEADER ---
    doc.fillColor(primaryColor).fontSize(20).font('Helvetica-Bold').text('FICHA TÉCNICA DE CONDUCTOR', { align: 'center' });
    doc.moveDown(0.5);

    // Line separator
    doc.strokeColor(accentColor).lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1.5);

    // --- DATOS PERSONALES ---
    const xLeft = 50;
    const xRight = 300;
    const yStart = doc.y;

    // Section Header
    doc.rect(50, doc.y, 500, 25).fill(boxBgColor);
    doc
      .fillColor(primaryColor)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('INFORMACIÓN PERSONAL', 60, doc.y + 7); // y + padding
    doc.moveDown(2);

    // Fields
    const addField = (label: string, value: string, x: number, y: number) => {
      doc.fillColor(secondaryColor).fontSize(10).font('Helvetica-Bold').text(label, x, y);
      doc
        .fillColor(primaryColor)
        .fontSize(10)
        .font('Helvetica')
        .text(value, x, y + 15);
    };

    let currentY = doc.y;

    // Row 1
    addField('NOMBRES', conductor.nombres, xLeft, currentY);
    addField('APELLIDOS', conductor.apellidos, xRight, currentY);
    currentY += 40;

    // Row 2
    addField('TIPO DOCUMENTO', conductor.tipoDocumento, xLeft, currentY);
    addField('NUMERO DOCUMENTO', conductor.dni, xRight, currentY);
    currentY += 40;

    // Row 3 (Licencia)
    addField('LICENCIA', conductor.numeroLicencia, xLeft, currentY);
    addField('CLASE / CATEGORÍA', `${conductor.claseLicencia} - ${conductor.categoriaLicencia}`, xRight, currentY);
    currentY += 40;

    // Row 4 (Nacionalidad)
    addField('NACIONALIDAD', conductor.nacionalidad || '-', xLeft, currentY);
    currentY += 40;

    // --- CONTACTO ---
    doc.y = currentY + 10;
    doc.rect(50, doc.y, 500, 25).fill(boxBgColor);
    doc
      .fillColor(primaryColor)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('INFORMACIÓN DE CONTACTO', 60, doc.y + 7);
    doc.moveDown(2);

    currentY = doc.y;
    addField('EMAIL', conductor.email || '-', xLeft, currentY);
    addField('CELULAR', conductor.celular || '-', xRight, currentY);
    currentY += 40;

    // --- DOCUMENTOS ---
    doc.y = currentY + 10;
    doc.rect(50, doc.y, 500, 25).fill(boxBgColor);
    doc
      .fillColor(primaryColor)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('ESTADO DOCUMENTARIO', 60, doc.y + 7);
    doc.moveDown(2);

    // Table Header
    const tableTop = doc.y;
    const col1 = 50; // Tipo
    const col2 = 350; // Estado
    const col3 = 450; // Vencimiento

    doc.fillColor(secondaryColor).fontSize(10).font('Helvetica-Bold');
    doc.text('DOCUMENTO', col1, tableTop);
    doc.text('ESTADO', col2, tableTop);
    doc.text('VENCIMIENTO', col3, tableTop);

    doc
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    doc.moveDown(1.5);

    // Fetch documents info for URL downloading (preserved logic) but just listing them here
    const documentos = await this.conductorDocumentoRepository.findByConductorId(id);

    doc.font('Helvetica').fontSize(10);

    // List all possible documents or just the ones they have?
    // Let's list the ones they have, plus general status maybe?
    // Just list what is found as per previous logic
    if (documentos.length === 0) {
      doc.fillColor(secondaryColor).text('No se encontraron documentos registrados.', 50, doc.y + 10);
    }

    const mapDocLabel = (tipo: string) => {
      return tipo.replace(/_/g, ' ').toUpperCase();
    };

    let docY = doc.y;
    for (const docInfo of documentos) {
      const status = docInfo.url ? 'ADJUNTADO' : 'PENDIENTE';
      const vencimiento = docInfo.fechaExpiracion ? new Date(docInfo.fechaExpiracion).toLocaleDateString() : '-';

      // Alternating row background could be nice, but simple lines needed?
      // Just text
      doc.fillColor(primaryColor);
      doc.text(mapDocLabel(docInfo.tipo), col1, docY);

      doc.fillColor(docInfo.url ? 'green' : 'red');
      doc.text(status, col2, docY);

      doc.fillColor(primaryColor);
      doc.text(vencimiento, col3, docY);

      docY += 20;

      // Divider
      doc
        .strokeColor('#f3f4f6')
        .lineWidth(0.5)
        .moveTo(50, docY - 5)
        .lineTo(550, docY - 5)
        .stroke();
    }

    doc.text('', 50, docY); // Restore cursor

    // --- FOTOCHECKS DOWNLOAD LOOP (Hidden from PDF now) ---
    // Keep downloading fotochecks to ZIP
    if (conductor.fotocheck && conductor.fotocheck.length > 0) {
      for (let i = 0; i < conductor.fotocheck.length; i++) {
        let url = conductor.fotocheck[i];
        if (url) {
          // Force JPG for header/consistency if needed, but for ZIP original is fine or JPG.
          // Let's keep the JPG replacement for robustness even if not valid for PDF anymore
          if (url.includes('cloudinary.com') && !url.includes('/f_jpg') && !url.includes('/f_png')) {
            url = url.replace('/upload/', '/upload/f_jpg/');
          }
          try {
            const response = await fetch(url);
            if (response.ok) {
              const buffer = Buffer.from(await response.arrayBuffer());
              const ext = url.split('.').pop()?.split('?')[0] || 'jpg';
              archive.append(buffer, { name: `fotocheck_${i + 1}.${ext}` });
            }
          } catch (console) {
            // Ignore download errors for fotocheck
          }
        }
      }
    }

    // --- DOCUMENTOS DOWNLOAD LOOP ---
    for (const docInfo of documentos) {
      if (docInfo.url) {
        try {
          const response = await fetch(docInfo.url);
          if (response.ok) {
            const buffer = Buffer.from(await response.arrayBuffer());
            const ext = docInfo.url.split('.').pop()?.split('?')[0] || 'pdf';
            const docName = `${docInfo.tipo}_${docInfo.nombre || 'doc'}.${ext}`.replace(/[^a-zA-Z0-9._-]/g, '_');
            archive.append(buffer, { name: `documentos/${docName}` });
          }
        } catch (error) {
          console.error(`Error downloading document ${docInfo.url}`, error);
        }
      }
    }

    // Finalize PDF
    doc.end();

    // Finalize archive
    void archive.finalize();

    return { stream: archive, filename };
  }
}
