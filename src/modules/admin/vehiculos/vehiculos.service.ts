import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { VehiculoRepository } from '@repository/vehiculo.repository';
import { VehiculoDocumentoRepository } from '@repository/vehiculo-documento.repository';
import { MarcaRepository } from '@repository/marca.repository';
import { ModeloRepository } from '@repository/modelo.repository';
import { VehiculoCreateDto } from './dto/vehiculo/vehiculo-create.dto';
import { VehiculoUpdateDto } from './dto/vehiculo/vehiculo-update.dto';
import { PaginatedVehiculoResultDto } from './dto/vehiculo/vehiculo-paginated.dto';
import { VehiculoDocumentoDTO, vehiculoDocumentosTipo } from '@db/tables/vehiculo-documento.table';
import { DocumentosAgrupadosVehiculoDto } from './dto/vehiculo/vehiculo-result.dto';
import { MarcaCreateDto } from './dto/marca/marca-create.dto';
import { MarcaUpdateDto } from './dto/marca/marca-update.dto';
import { ModeloCreateDto } from './dto/modelo/modelo-create.dto';
import { ModeloUpdateDto } from './dto/modelo/modelo-update.dto';

import { VehiculoChecklistDocumentRepository } from '@repository/vehiculo-checklist-document.repository';
import { ChecklistItemRepository } from '@repository/checklist-item.repository';
import { VehiculoChecklistDocumentCreateDto } from './dto/checklist-document/create-checklist-document.dto';

import { IpercContinuoDto } from './dto/checklist-document/types/payload-iperc-continuo.dto';
import { LucesEmergenciaAlarmasDto } from './dto/checklist-document/types/payload-luces-emergencia-alarmas.dto';
import { HojaInspeccionDto } from './dto/checklist-document/types/payload-hoja-inspeccion.dto';
import { InspeccionDocumentosDto } from './dto/checklist-document/types/payload-inspeccion-documentos.dto';
import { CinturonesSeguridadDto } from './dto/checklist-document/types/payload-cinturones-seguridad.dto';
import { InspeccionHerramientasDto } from './dto/checklist-document/types/payload-inspeccion-herramientas.dto';
import { InspeccionBotiquinesDto } from './dto/checklist-document/types/payload-inspeccion-botiquines.dto';
import { KitAntiderramesDto } from './dto/checklist-document/types/payload-kit-antiderrames.dto';
import { RevisionVehiculosDto } from './dto/checklist-document/types/payload-revision-vehiculos.dto';

import { ResultIpercContinuoDto, ResultIpercDocumentDto } from './dto/checklist-document/types/result-iperc-continuo.dto';
import {
  ResultLucesEmergenciaAlarmasDto,
  ResultLucesEmergenciaAlarmasDocumentDto,
} from './dto/checklist-document/types/result-luces-emergencia-alarmas.dto';
import { ResultHojaInspeccionDto, ResultHojaDocumentDto } from './dto/checklist-document/types/result-hoja-inspeccion.dto';
import {
  ResultInspeccionDocumentosDto,
  ResultInspeccionDocumentosDocumentDto,
} from './dto/checklist-document/types/result-inspeccion-documentos.dto';
import { ResultCinturonesSeguridadDto, ResultCinturonesDocumentDto } from './dto/checklist-document/types/result-cinturones-seguridad.dto';
import {
  ResultInspeccionHerramientasDto,
  ResultInspeccionHerramientasDocumentDto,
} from './dto/checklist-document/types/result-inspeccion-herramientas.dto';
import {
  ResultInspeccionBotiquinesDto,
  ResultInspeccionBotiquinesDocumentDto,
} from './dto/checklist-document/types/result-inspeccion-botiquines.dto';
import { ResultKitAntiderramesDto, ResultKitDocumentDto } from './dto/checklist-document/types/result-kit-antiderrames.dto';
import { ResultRevisionVehiculosDto, ResultRevisionDocumentDto } from './dto/checklist-document/types/result-revision-vehiculos.dto';
import { VehiculoChecklistDocument } from 'src/db/tables/vehiculo-checklist-document.table';
import { VehiculoChecklistDocumentItem } from 'src/db/tables/vehiculo-checklist-document-item.table';

type ChecklistWithItems = VehiculoChecklistDocument & { items: VehiculoChecklistDocumentItem[] };

import { IpercContinuoModel, IpercContinuoMap } from './dto/checklist-document/models/iperc-continuo.model';
import { LucesEmergenciaAlarmasModel, LucesEmergenciaAlarmasMap } from './dto/checklist-document/models/luces-emergencia-alarmas.model';
import { HojaInspeccionModel, HojaInspeccionMap, HojaSecciones } from './dto/checklist-document/models/hoja-inspeccion.model';
import { InspeccionDocumentosModel, InspeccionDocumentosMap, DocumentosSecciones } from './dto/checklist-document/models/inspeccion-documentos.model';
import { CinturonesSeguridadModel, CinturonesSeguridadMap } from './dto/checklist-document/models/cinturones-seguridad.model';
import {
  InspeccionHerramientasModel,
  InspeccionHerramientasMap,
  HerramientasInfo,
  HerramientasSecciones,
} from './dto/checklist-document/models/inspeccion-herramientas.model';
import { InspeccionBotiquinesModel, InspeccionBotiquinesMap } from './dto/checklist-document/models/inspeccion-botiquines.model';
import { KitAntiderramesModel, KitAntiderramesMap } from './dto/checklist-document/models/kit-antiderrames.model';
import { RevisionVehiculosModel, RevisionVehiculosMap } from './dto/checklist-document/models/revision-vehiculos.model';

@Injectable()
export class VehiculosService {
  constructor(
    private readonly vehiculoRepository: VehiculoRepository,
    private readonly vehiculoDocumentoRepository: VehiculoDocumentoRepository,
    private readonly marcaRepository: MarcaRepository,
    private readonly modeloRepository: ModeloRepository,
    private readonly vehiculoChecklistDocumentRepository: VehiculoChecklistDocumentRepository,
    private readonly checklistItemRepository: ChecklistItemRepository,
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    fechaInicio?: string,
    fechaFin?: string,
    estado?: string,
  ): Promise<PaginatedVehiculoResultDto> {
    const { data, total } = await this.vehiculoRepository.findAllPaginated(page, limit, { search, fechaInicio, fechaFin, estado });
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
    const vehiculo = await this.vehiculoRepository.findOne(id);
    const documentos = await this.vehiculoDocumentoRepository.findByVehiculoId(id);

    const documentosAgrupados = vehiculoDocumentosTipo.enumValues.reduce((acc, tipo) => {
      acc[tipo] = documentos.filter((doc) => doc.tipo === tipo);
      return acc;
    }, {} as DocumentosAgrupadosVehiculoDto);

    return {
      ...vehiculo,
      documentos: documentosAgrupados,
    };
  }

  async create(data: VehiculoCreateDto) {
    const vehiculo = await this.vehiculoRepository.create(data);
    const codigoInterno = this.generarCodigoInterno(vehiculo.id);
    return this.vehiculoRepository.update(vehiculo.id, { codigoInterno });
  }

  private generarCodigoInterno(id: number): string {
    return String(id).padStart(5, '0');
  }

  update(id: number, data: VehiculoUpdateDto) {
    return this.vehiculoRepository.update(id, data);
  }

  delete(id: number) {
    return this.vehiculoRepository.delete(id);
  }

  // ========== DOCUMENTOS ==========
  async findDocumento(id: number) {
    return await this.vehiculoDocumentoRepository.findOne(id);
  }

  async createDocumento(data: Partial<VehiculoDocumentoDTO>) {
    return await this.vehiculoDocumentoRepository.create(data as VehiculoDocumentoDTO);
  }

  async updateDocumento(id: number, data: Partial<VehiculoDocumentoDTO>) {
    return await this.vehiculoDocumentoRepository.update(id, data);
  }

  async deleteDocumento(id: number) {
    return await this.vehiculoDocumentoRepository.delete(id);
  }

  // ========== MARCAS ==========

  async findAllMarcasPaginated(page: number = 1, limit: number = 10, search?: string, fechaInicio?: string, fechaFin?: string) {
    const { data, total } = await this.marcaRepository.findAllPaginated(page, limit, { search, fechaInicio, fechaFin });
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

  async findOneMarca(id: number) {
    return await this.marcaRepository.findOne(id);
  }

  async createMarca(data: MarcaCreateDto) {
    return await this.marcaRepository.create(data);
  }

  async updateMarca(id: number, data: MarcaUpdateDto) {
    return await this.marcaRepository.update(id, data);
  }

  async deleteMarca(id: number) {
    return await this.marcaRepository.delete(id);
  }

  // ========== MODELOS ==========

  async findAllModelosPaginated(page: number = 1, limit: number = 10, search?: string, marcaId?: number, fechaInicio?: string, fechaFin?: string) {
    const { data, total } = await this.modeloRepository.findAllPaginated(page, limit, { search, marcaId, fechaInicio, fechaFin });
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

  async findOneModelo(id: number) {
    return await this.modeloRepository.findOne(id);
  }

  async createModelo(data: ModeloCreateDto) {
    return await this.modeloRepository.create(data);
  }

  async updateModelo(id: number, data: ModeloUpdateDto) {
    return await this.modeloRepository.update(id, data);
  }

  async deleteModelo(id: number) {
    return await this.modeloRepository.delete(id);
  }

  // ========== MAPPERS EXPLICITOS (Endpoints Personalizados) ==========

  // 1. IPERC continuo
  async findIpercContinuo(vehiculoId: number, documentId?: number): Promise<ResultIpercContinuoDto> {
    const doc = await this.findChecklistVersion(vehiculoId, 'IPERC continuo', documentId);
    const result = new ResultIpercContinuoDto();
    result.viajeId = doc?.viajeId || null;
    result.vehiculoId = doc?.vehiculoId || vehiculoId;
    result.version = doc?.version || null;

    const items = doc?.items || [];
    const document = new ResultIpercDocumentDto();

    const label = 'Foto IPERC';
    const item = items.find((i) => i.label === label);

    document.photo = {
      url: item?.valorEsperado || '',
    };
    result.document = document;
    return result;
  }

  async upsertIpercContinuo(vehiculoId: number, viajeId: number, data: IpercContinuoDto): Promise<ResultIpercContinuoDto> {
    const nombreChecklist = 'IPERC continuo';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automaticamente' });

    const items = IpercContinuoModel.map((modelItem) => {
      if (modelItem.label === 'Foto IPERC') {
        return {
          ...modelItem,
          valorEsperado: data.photo.url,
          metadatos: {},
        };
      }
      return modelItem;
    });

    const savedDoc = await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
    return this.findIpercContinuo(vehiculoId, savedDoc.id);
  }

  // 2. Hoja de inspeccion
  async findHojaInspeccion(vehiculoId: number, documentId?: number): Promise<ResultHojaInspeccionDto> {
    const doc = await this.findChecklistVersion(vehiculoId, 'Hoja de inspeccion', documentId);
    const result = new ResultHojaInspeccionDto();
    result.viajeId = doc?.viajeId || null;
    result.vehiculoId = doc?.vehiculoId || vehiculoId;
    result.version = doc?.version || null;

    const items = doc?.items || [];
    const keys = Object.keys(HojaInspeccionMap) as (keyof typeof HojaInspeccionMap)[];

    // Inicializar documento y secciones
    const document = new ResultHojaDocumentDto();
    for (const secKey of Object.keys(HojaSecciones)) {
      document[secKey] = {
        label: HojaSecciones[secKey as keyof typeof HojaSecciones],
        items: {},
      };
    }

    for (const label of keys) {
      const key = HojaInspeccionMap[label];
      const item = items.find((i) => i.label === label);
      const modelItem = HojaInspeccionModel.find((m) => m.label === label); // Obtener metadata fresca del modelo

      if (modelItem) {
        const sectionKey = modelItem.metadatos?.seccion;
        if (sectionKey && document[sectionKey]) {
          document[sectionKey].items[key] = {
            label,
            color: modelItem.metadatos?.color,
            value: item?.valorEsperado === 'true',
          };
        }
      }
    }
    result.document = document;
    return result;
  }

  async upsertHojaInspeccion(vehiculoId: number, viajeId: number, data: HojaInspeccionDto): Promise<ResultHojaInspeccionDto> {
    const nombreChecklist = 'Hoja de inspeccion';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automaticamente' });

    const items = HojaInspeccionModel.map((modelItem) => {
      const dtoKey = HojaInspeccionMap[modelItem.label];
      const dtoValue = data[dtoKey];

      if (dtoValue !== undefined) {
        return {
          ...modelItem,
          valorEsperado: String(dtoValue),
          metadatos: {},
        };
      }
      return modelItem;
    });

    const savedDoc = await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
    return this.findHojaInspeccion(vehiculoId, savedDoc.id);
  }

  // 3. Inspeccion de documentos
  async findInspeccionDocumentos(vehiculoId: number, documentId?: number): Promise<ResultInspeccionDocumentosDto> {
    const doc = await this.findChecklistVersion(vehiculoId, 'Inspeccion de documentos', documentId);
    const result = new ResultInspeccionDocumentosDto();
    result.viajeId = doc?.viajeId || null;
    result.vehiculoId = doc?.vehiculoId || vehiculoId;
    result.version = doc?.version || null;

    const items = doc?.items || [];
    const keys = Object.keys(InspeccionDocumentosMap) as (keyof typeof InspeccionDocumentosMap)[];

    const document = new ResultInspeccionDocumentosDocumentDto();
    for (const secKey of Object.keys(DocumentosSecciones)) {
      document[secKey] = {
        label: DocumentosSecciones[secKey as keyof typeof DocumentosSecciones],
        items: {},
      };
    }

    for (const label of keys) {
      const key = InspeccionDocumentosMap[label];
      const item = items.find((i) => i.label === label);
      const modelItem = InspeccionDocumentosModel.find((m) => m.label === label);

      if (modelItem) {
        const sectionKey = modelItem.metadatos?.seccion;
        if (sectionKey && document[sectionKey]) {
          document[sectionKey].items[key] = {
            label,
            habilitado: item?.valorEsperado === 'true',
            fechaVencimiento: item?.metadatos?.fechaVencimiento || null,
            observacion: item?.metadatos?.observacion || '',
          };
        }
      }
    }
    result.document = document;
    return result;
  }

  async upsertInspeccionDocumentos(vehiculoId: number, viajeId: number, data: InspeccionDocumentosDto): Promise<ResultInspeccionDocumentosDto> {
    const nombreChecklist = 'Inspeccion de documentos';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automaticamente' });

    const items = InspeccionDocumentosModel.map((modelItem) => {
      const dtoKey = InspeccionDocumentosMap[modelItem.label] as keyof InspeccionDocumentosDto;
      const dtoValue = data[dtoKey];

      if (dtoKey && dtoValue && typeof dtoValue === 'object' && 'habilitado' in dtoValue) {
        return {
          ...modelItem,
          valorEsperado: String(dtoValue.habilitado),
          metadatos: {
            fechaVencimiento: dtoValue.fechaVencimiento,
            observacion: dtoValue.observacion,
          },
        };
      }
      return modelItem;
    });

    const savedDoc = await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
    return this.findInspeccionDocumentos(vehiculoId, savedDoc.id);
  }

  // 4. Luces de emergencia y alarmas
  async findLucesChecklist(vehiculoId: number, documentId?: number): Promise<ResultLucesEmergenciaAlarmasDto> {
    const doc = await this.findChecklistVersion(vehiculoId, 'Luces de emergencia y alarmas', documentId);
    const result = new ResultLucesEmergenciaAlarmasDto();
    result.viajeId = doc?.viajeId || null;
    result.vehiculoId = doc?.vehiculoId || vehiculoId;
    result.version = doc?.version || null;

    const items = doc?.items || [];
    const keys = Object.keys(LucesEmergenciaAlarmasMap) as (keyof typeof LucesEmergenciaAlarmasMap)[];

    const document = new ResultLucesEmergenciaAlarmasDocumentDto();

    for (const label of keys) {
      const key = LucesEmergenciaAlarmasMap[label];
      const item = items.find((i) => i.label === label);
      if (item) {
        document[key] = {
          label,
          estado: item.valorEsperado === 'true',
          observacion: item.metadatos?.observacion || '',
        };
      } else {
        document[key] = { label, estado: false, observacion: '' };
      }
    }
    result.document = document;
    return result;
  }

  async upsertLucesChecklist(vehiculoId: number, viajeId: number, data: LucesEmergenciaAlarmasDto): Promise<ResultLucesEmergenciaAlarmasDto> {
    const nombreChecklist = 'Luces de emergencia y alarmas';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automaticamente' });

    const items = LucesEmergenciaAlarmasModel.map((modelItem) => {
      const dtoKey = LucesEmergenciaAlarmasMap[modelItem.label] as keyof LucesEmergenciaAlarmasDto;
      const dtoValue = data[dtoKey];
      if (dtoValue && typeof dtoValue === 'object') {
        return {
          ...modelItem,
          valorEsperado: String(dtoValue.estado),
          metadatos: {
            observacion: dtoValue.observacion,
          },
        };
      }
      return modelItem;
    });

    const savedDoc = await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
    return this.findLucesChecklist(vehiculoId, savedDoc.id);
  }

  // 5. Cinturones de seguridad
  async findCinturones(vehiculoId: number, documentId?: number): Promise<ResultCinturonesSeguridadDto> {
    const doc = await this.findChecklistVersion(vehiculoId, 'Cinturones de seguridad', documentId);
    const result = new ResultCinturonesSeguridadDto();
    result.viajeId = doc?.viajeId || null;
    result.vehiculoId = doc?.vehiculoId || vehiculoId;
    result.version = doc?.version || null;

    const items = doc?.items || [];
    const keys = Object.keys(CinturonesSeguridadMap) as (keyof typeof CinturonesSeguridadMap)[];

    const document = new ResultCinturonesDocumentDto();
    for (const label of keys) {
      const key = CinturonesSeguridadMap[label];
      const item = items.find((i) => i.label === label);
      if (item) {
        document[key] = { label, habilitado: item.valorEsperado === 'true', ...item.metadatos };
      } else {
        document[key] = { label, habilitado: false, observacion: '' };
      }
    }
    result.document = document;
    return result;
  }

  async upsertCinturones(vehiculoId: number, viajeId: number, data: CinturonesSeguridadDto): Promise<ResultCinturonesSeguridadDto> {
    const nombreChecklist = 'Cinturones de seguridad';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automaticamente' });

    const items = CinturonesSeguridadModel.map((modelItem) => {
      const dtoKey = CinturonesSeguridadMap[modelItem.label] as keyof CinturonesSeguridadDto;
      const dtoValue = data[dtoKey];

      if (dtoKey && dtoValue && typeof dtoValue === 'object' && 'habilitado' in dtoValue) {
        return {
          ...modelItem,
          valorEsperado: String(dtoValue.habilitado),
          metadatos: {
            observacion: dtoValue.observacion,
          },
        };
      }
      return modelItem;
    });

    const savedDoc = await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
    return this.findCinturones(vehiculoId, savedDoc.id);
  }

  // 6. Inspeccion de herramientas
  async findHerramientas(vehiculoId: number, documentId?: number): Promise<ResultInspeccionHerramientasDto> {
    const doc = await this.findChecklistVersion(vehiculoId, 'Inspeccion de herramientas', documentId);
    const result = new ResultInspeccionHerramientasDto();
    result.viajeId = doc?.viajeId || null;
    result.vehiculoId = doc?.vehiculoId || vehiculoId;
    result.version = doc?.version || null;

    const items = doc?.items || [];
    const keys = Object.keys(InspeccionHerramientasMap) as (keyof typeof InspeccionHerramientasMap)[];

    const document = new ResultInspeccionHerramientasDocumentDto();
    
    for (const secKey of Object.keys(HerramientasSecciones)) {
      if (secKey === 'info') {
        document[secKey] = HerramientasInfo;
        continue;
      }
      document[secKey] = {};

      for (const label of keys) {
        const key = InspeccionHerramientasMap[label];
        const item = items.find((i) => i.label === label);
        if (item) {
          document[secKey][key] = {
            label,
            estado: item.metadatos?.estado ?? false,
            stock: item.metadatos?.stock,
            criterioA: item.metadatos?.criterioA,
            criterioB: item.metadatos?.criterioB,
            criterioC: item.metadatos?.criterioC,
            criterioD: item.metadatos?.criterioD,
            criterioE: item.metadatos?.criterioE,
            criterioF: item.metadatos?.criterioF,
            accionCorrectiva: item.metadatos?.accionCorrectiva,
            observacion: item.metadatos?.observacion,
          };
        } else {
          document[secKey][key] = {
            label,
            estado: false,
            stock: '',
            criterioA: false,
            criterioB: false,
            criterioC: false,
            criterioD: false,
            criterioE: false,
            criterioF: false,
            accionCorrectiva: '',
            observacion: '',
          };
        }
      }
    }
    result.document = document;
    return result;
  }

  async upsertHerramientas(vehiculoId: number, viajeId: number, data: InspeccionHerramientasDto): Promise<ResultInspeccionHerramientasDto> {
    const nombreChecklist = 'Inspeccion de herramientas';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automaticamente' });

    const items = InspeccionHerramientasModel.map((modelItem) => {
      const dtoKey = InspeccionHerramientasMap[modelItem.label] as keyof InspeccionHerramientasDto;
      const dtoValue = data[dtoKey];

      if (dtoValue && typeof dtoValue === 'object') {
        return {
          ...modelItem,
          valorEsperado: String(dtoValue.estado),
          metadatos: {
            stock: dtoValue.stock,
            criterioA: dtoValue.criterioA,
            criterioB: dtoValue.criterioB,
            criterioC: dtoValue.criterioC,
            criterioD: dtoValue.criterioD,
            criterioE: dtoValue.criterioE,
            criterioF: dtoValue.criterioF,
            observacion: dtoValue.observacion,
            accionCorrectiva: dtoValue.accionCorrectiva,
          },
        };
      }
      return modelItem;
    });

    const savedDoc = await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
    return this.findHerramientas(vehiculoId, savedDoc.id);
  }

  // 7. Inspeccion de botiquines
  async findBotiquines(vehiculoId: number, documentId?: number): Promise<ResultInspeccionBotiquinesDto> {
    const doc = await this.findChecklistVersion(vehiculoId, 'Inspeccion de botiquines', documentId);
    const result = new ResultInspeccionBotiquinesDto();
    result.viajeId = doc?.viajeId || null;
    result.vehiculoId = doc?.vehiculoId || vehiculoId;
    result.version = doc?.version || null;

    const items = doc?.items || [];
    const keys = Object.keys(InspeccionBotiquinesMap) as (keyof typeof InspeccionBotiquinesMap)[];

    const document = new ResultInspeccionBotiquinesDocumentDto();
    document.ubicacionBotiquin = '';

    for (const label of keys) {
      const key = InspeccionBotiquinesMap[label];
      const item = items.find((i) => i.label === label);
      if (item) {
        if (key === 'ubicacionBotiquin') {
          // Si es ubicacion, el valor esta en metadatos (posiblemente 'value' o directo si es string, pero metadatos es obj)
          // Asumimos que se guardó como { value: '...' } o similar por el DTO
          document[key] = item.metadatos?.value || item.metadatos?.ubicacionBotiquin || '';
        } else {
          document[key] = {
            label,
            habilitado: item.valorEsperado === 'true',
            fechaVencimiento: item.metadatos?.fechaVencimiento,
            fechaSalida: item.metadatos?.fechaSalida,
            fechaReposicion: item.metadatos?.fechaReposicion,
          };
        }
      } else if (key !== 'ubicacionBotiquin') {
        document[key] = { label, habilitado: false, fechaVencimiento: null, fechaSalida: null, fechaReposicion: null };
      }
    }
    result.document = document;
    return result;
  }

  async upsertBotiquines(vehiculoId: number, viajeId: number, data: InspeccionBotiquinesDto): Promise<ResultInspeccionBotiquinesDto> {
    const nombreChecklist = 'Inspeccion de botiquines';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automaticamente' });

    const items = InspeccionBotiquinesModel.map((modelItem) => {
      const dtoKey = InspeccionBotiquinesMap[modelItem.label] as keyof InspeccionBotiquinesDto;
      const dtoValue = data[dtoKey];

      if (dtoKey && dtoValue && typeof dtoValue === 'object' && 'habilitado' in dtoValue) {
        return {
          ...modelItem,
          valorEsperado: String(dtoValue.habilitado),
          metadatos: {
            fechaVencimiento: dtoValue.fechaVencimiento,
            fechaSalida: dtoValue.fechaSalida,
            fechaReposicion: dtoValue.fechaReposicion,
          },
        };
      } else if (dtoKey === 'ubicacionBotiquin' && typeof dtoValue === 'string') {
        return {
          ...modelItem,
          valorEsperado: dtoValue,
        };
      }
      return modelItem;
    });

    const savedDoc = await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
    return this.findBotiquines(vehiculoId, savedDoc.id);
  }

  // 8. Kit anti derrames
  async findKitAntiderrames(vehiculoId: number, documentId?: number): Promise<ResultKitAntiderramesDto> {
    const doc = await this.findChecklistVersion(vehiculoId, 'Kit anti derrames', documentId);
    const result = new ResultKitAntiderramesDto();
    result.viajeId = doc?.viajeId || null;
    result.vehiculoId = doc?.vehiculoId || vehiculoId;
    result.version = doc?.version || null;

    const items = doc?.items || [];
    const keys = Object.keys(KitAntiderramesMap) as (keyof typeof KitAntiderramesMap)[];

    const document = new ResultKitDocumentDto();
    document.ubicacion = '';

    for (const label of keys) {
      const key = KitAntiderramesMap[label];
      const item = items.find((i) => i.label === label);

      if (key === 'ubicacion') {
        document[key] = item?.metadatos?.value || item?.metadatos?.ubicacion || item?.valorEsperado || '';
      } else {
        if (item) {
          document[key] = {
            label,
            estado: item.valorEsperado === 'true',
          };
        } else {
          document[key] = { label, estado: false };
        }
      }
    }
    result.document = document;
    return result;
  }

  async upsertKitAntiderrames(vehiculoId: number, viajeId: number, data: KitAntiderramesDto): Promise<ResultKitAntiderramesDto> {
    const nombreChecklist = 'Kit anti derrames';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automaticamente' });

    const items = KitAntiderramesModel.map((modelItem) => {
      const dtoKey = KitAntiderramesMap[modelItem.label] as keyof KitAntiderramesDto;
      const dtoValue = data[dtoKey];

      if (dtoKey === 'ubicacion') {
        // Ubicacion might be string or undefined
        if (typeof dtoValue === 'string') {
          return {
            ...modelItem,
            valorEsperado: dtoValue,
            metadatos: {},
          };
        }
        // If undefined, keep model default
        return modelItem;
      }

      if (dtoValue !== undefined && typeof dtoValue === 'boolean') {
        return {
          ...modelItem,
          valorEsperado: String(dtoValue),
          metadatos: {},
        };
      }
      return modelItem;
    });

    const savedDoc = await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
    return this.findKitAntiderrames(vehiculoId, savedDoc.id);
  }

  // 9. Revision de vehiculos
  async findRevisionVehiculos(vehiculoId: number, documentId?: number): Promise<ResultRevisionVehiculosDto> {
    const doc = await this.findChecklistVersion(vehiculoId, 'Revision de vehiculos', documentId);
    const result = new ResultRevisionVehiculosDto();
    result.viajeId = doc?.viajeId || null;
    result.vehiculoId = doc?.vehiculoId || vehiculoId;
    result.version = doc?.version || null;

    const items = doc?.items || [];
    const document = new ResultRevisionDocumentDto();

    const label = 'Foto Revision';
    const item = items.find((i) => i.label === label);

    document.photo = {
      url: item?.valorEsperado || '',
    };
    result.document = document;
    return result;
  }

  async upsertRevisionVehiculos(vehiculoId: number, viajeId: number, data: RevisionVehiculosDto): Promise<ResultRevisionVehiculosDto> {
    const nombreChecklist = 'Revision de vehiculos';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automaticamente' });

    const items = RevisionVehiculosModel.map((modelItem) => {
      if (modelItem.label === 'Foto Revision') {
        return {
          ...modelItem,
          valorEsperado: data.photo.url,
          metadatos: {},
        };
      }
      return modelItem;
    });

    const savedDoc = await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
    return this.findRevisionVehiculos(vehiculoId, savedDoc.id);
  }

  // ========== CHECKLIST CONFIGURACION (VERSIONADO) ==========

  private async findChecklistVersion(vehiculoId: number, name: string, documentId?: number): Promise<ChecklistWithItems | undefined> {
    const catalogo = await this.checklistItemRepository.findByNombre(name);
    if (!catalogo) throw new NotFoundException(`El checklist '${name}' no existe`);

    let doc: ChecklistWithItems | undefined;
    if (documentId) {
      doc = await this.vehiculoChecklistDocumentRepository.findByIdWithItems(documentId);
      if (!doc) throw new NotFoundException('Documento no encontrado');
      if (doc.checklistItemId !== catalogo.id) throw new ConflictException('El documento no corresponde al tipo de checklist solicitado');
      if (doc.vehiculoId !== vehiculoId) throw new ConflictException('El documento no pertenece al vehículo solicitado');
    } else {
      doc = await this.vehiculoChecklistDocumentRepository.findActiveOrLatestWithItems(vehiculoId, catalogo.id);
    }

    return doc;
  }

  async createChecklistVersion(vehiculoId: number, data: VehiculoChecklistDocumentCreateDto, viajeId?: number) {
    const catalogo = await this.checklistItemRepository.findOne(data.checklistItemId);
    if (!catalogo) throw new NotFoundException('El tipo de checklist no existe');

    const vehiculoPart = String(vehiculoId).padStart(5, '0');
    const itemPart = String(data.checklistItemId).padStart(3, '0');
    const viajePart = viajeId ? String(viajeId).padStart(10, '0') : '0000000000';
    const codigoVersion = `v${vehiculoPart}_${itemPart}_${viajePart}`;

    const existingDoc = await this.vehiculoChecklistDocumentRepository.findByVersion(vehiculoId, data.checklistItemId, codigoVersion);

    let docId;
    if (existingDoc) {
      docId = existingDoc.id;
      await this.vehiculoChecklistDocumentRepository.deleteItems(docId);
      if (!existingDoc.activo) {
        await this.vehiculoChecklistDocumentRepository.activate(docId);
      }
    } else {
      const newDoc = await this.vehiculoChecklistDocumentRepository.create({
        vehiculoId,
        checklistItemId: data.checklistItemId,
        version: codigoVersion,
        activo: true,
        viajeId: viajeId || null,
      });
      docId = newDoc.id;
    }

    const itemsWithDocId = data.items.map((item) => ({
      ...item,
      vehiculoChecklistDocumentId: docId,
    }));

    const savedItems = await this.vehiculoChecklistDocumentRepository.createItems(itemsWithDocId);

    const activeDoc = await this.vehiculoChecklistDocumentRepository.findActive(vehiculoId, data.checklistItemId);
    if (activeDoc && activeDoc.id !== docId) {
      await this.vehiculoChecklistDocumentRepository.deactivate(activeDoc.id);
    }

    return {
      id: docId,
      version: codigoVersion,
      items: savedItems,
    };
  }
}
