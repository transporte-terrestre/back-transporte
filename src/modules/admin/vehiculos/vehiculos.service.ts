import { Injectable } from '@nestjs/common';
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
import { NotFoundException } from '@nestjs/common';
import { LucesEmergenciaAlarmasDto } from './dto/checklist-document/types/luces-emergencia-alarmas.dto';
import { HojaInspeccionDto } from './dto/checklist-document/types/hoja-inspeccion.dto';
import { InspeccionDocumentosDto } from './dto/checklist-document/types/inspeccion-documentos.dto';
import { CinturonesSeguridadDto } from './dto/checklist-document/types/cinturones-seguridad.dto';
import { InspeccionHerramientasDto } from './dto/checklist-document/types/inspeccion-herramientas.dto';
import { InspeccionBotiquinesDto } from './dto/checklist-document/types/inspeccion-botiquines.dto';
import { KitAntiderramesDto } from './dto/checklist-document/types/kit-antiderrames.dto';
import { RevisionVehiculosDto } from './dto/checklist-document/types/revision-vehiculos.dto';

import { LucesEmergenciaAlarmasModel, LucesEmergenciaAlarmasMap } from './dto/checklist-document/models/luces-emergencia-alarmas.model';
import { HojaInspeccionModel } from './dto/checklist-document/models/hoja-inspeccion.model';
import { InspeccionDocumentosModel, InspeccionDocumentosMap } from './dto/checklist-document/models/inspeccion-documentos.model';
import { CinturonesSeguridadModel, CinturonesSeguridadMap } from './dto/checklist-document/models/cinturones-seguridad.model';
import { InspeccionHerramientasModel, InspeccionHerramientasMap } from './dto/checklist-document/models/inspeccion-herramientas.model';
import { InspeccionBotiquinesModel, InspeccionBotiquinesMap } from './dto/checklist-document/models/inspeccion-botiquines.model';
import { KitAntiderramesModel } from './dto/checklist-document/models/kit-antiderrames.model';
import { RevisionVehiculosModel } from './dto/checklist-document/models/revision-vehiculos.model';

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

  async upsertLucesChecklist(vehiculoId: number, viajeId: number, data: LucesEmergenciaAlarmasDto) {
    const nombreChecklist = 'Luces de emergencia y alarmas';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automáticamente' });

    // Mapping con el nuevo DTO anidado
    const items = LucesEmergenciaAlarmasModel.map((modelItem) => {
      const dtoKey = LucesEmergenciaAlarmasMap[modelItem.label] as keyof LucesEmergenciaAlarmasDto;
      const dtoValue = data[dtoKey];
      if (dtoValue && typeof dtoValue === 'object') {
        return {
          ...modelItem,
          metadatos: {
            ...modelItem.metadatos,
            estado: dtoValue.estado,
            observacion: dtoValue.observacion,
          },
        };
      }
      return modelItem;
    });

    return await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
  }

  async upsertHojaInspeccion(vehiculoId: number, viajeId: number, data: HojaInspeccionDto) {
    const nombreChecklist = 'Hoja de Inspección';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automáticamente' });

    const items = HojaInspeccionModel;
    return await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
  }

  async upsertInspeccionDocumentos(vehiculoId: number, viajeId: number, data: InspeccionDocumentosDto) {
    const nombreChecklist = 'Inspección de Documentos';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automáticamente' });

    const items = InspeccionDocumentosModel.map((modelItem) => {
      const dtoKey = InspeccionDocumentosMap[modelItem.label] as keyof InspeccionDocumentosDto;
      const dtoValue = data[dtoKey];

      if (dtoKey && dtoValue && typeof dtoValue === 'object' && 'habilitado' in dtoValue) {
        return {
          ...modelItem,
          metadatos: {
            ...modelItem.metadatos,
            fechaVencimiento: dtoValue.fechaVencimiento,
            observacionInicial: dtoValue.observacion,
          },
        };
      }
      return modelItem;
    });

    return await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
  }

  async upsertCinturones(vehiculoId: number, viajeId: number, data: CinturonesSeguridadDto) {
    const nombreChecklist = 'Cinturones de Seguridad';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automáticamente' });

    const items = CinturonesSeguridadModel.map((modelItem) => {
      const dtoKey = CinturonesSeguridadMap[modelItem.label] as keyof CinturonesSeguridadDto;
      const dtoValue = data[dtoKey];

      if (dtoKey && dtoValue && typeof dtoValue === 'object' && 'habilitado' in dtoValue) {
        return {
          ...modelItem,
          metadatos: {
            ...modelItem.metadatos,
            observacionInicial: dtoValue.observacion,
          },
        };
      }
      return modelItem;
    });

    return await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
  }

  async upsertHerramientas(vehiculoId: number, viajeId: number, data: InspeccionHerramientasDto) {
    const nombreChecklist = 'Inspección de Herramientas';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automáticamente' });

    // Mapping con el nuevo DTO anidado
    const items = InspeccionHerramientasModel.map((modelItem) => {
      const dtoKey = InspeccionHerramientasMap[modelItem.label] as keyof InspeccionHerramientasDto;
      const dtoValue = data[dtoKey];

      if (dtoValue && typeof dtoValue === 'object') {
        return {
          ...modelItem,
          metadatos: {
            ...modelItem.metadatos,
            estado: dtoValue.estado,
            stock: dtoValue.stock,
            criterioA: dtoValue.criterioA,
            criterioB: dtoValue.criterioB,
            criterioC: dtoValue.criterioC,
            criterioD: dtoValue.criterioD,
            criterioE: dtoValue.criterioE,
            criterioF: dtoValue.criterioF,
            accionCorrectiva: dtoValue.accionCorrectiva,
            observacion: dtoValue.observacion,
          },
        };
      }
      return modelItem;
    });

    return await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
  }

  async upsertBotiquines(vehiculoId: number, viajeId: number, data: InspeccionBotiquinesDto) {
    const nombreChecklist = 'Inspección de Botiquines';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automáticamente' });

    const items = InspeccionBotiquinesModel.map((modelItem) => {
      const dtoKey = InspeccionBotiquinesMap[modelItem.label] as keyof InspeccionBotiquinesDto;
      const dtoValue = data[dtoKey];

      if (dtoKey && dtoValue && typeof dtoValue === 'object' && 'habilitado' in dtoValue) {
        return {
          ...modelItem,
          metadatos: {
            ...modelItem.metadatos,
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

    return await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
  }

  async upsertKitAntiderrames(vehiculoId: number, viajeId: number, data: KitAntiderramesDto) {
    const nombreChecklist = 'Kit Antiderrames';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automáticamente' });

    const items = KitAntiderramesModel;
    return await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
  }

  async upsertRevisionVehiculos(vehiculoId: number, viajeId: number, data: RevisionVehiculosDto) {
    const nombreChecklist = 'Revisión de Vehículos';
    let catalogo = await this.checklistItemRepository.findByNombre(nombreChecklist);
    if (!catalogo) catalogo = await this.checklistItemRepository.create({ nombre: nombreChecklist, descripcion: 'Generado automáticamente' });

    const items = RevisionVehiculosModel;
    return await this.createChecklistVersion(vehiculoId, { checklistItemId: catalogo.id, items }, viajeId);
  }

  // ========== CHECKLIST CONFIGURACION (VERSIONADO) ==========

  async createChecklistVersion(vehiculoId: number, data: VehiculoChecklistDocumentCreateDto, viajeId?: number) {
    // 1. Validar Catalogo
    const catalogo = await this.checklistItemRepository.findOne(data.checklistItemId);
    if (!catalogo) throw new NotFoundException('El tipo de checklist no existe');

    // 2. Generar Codigo "vXXXXX_YYY_ZZZZZZZZZZ"
    const vehiculoPart = String(vehiculoId).padStart(5, '0');
    const itemPart = String(data.checklistItemId).padStart(3, '0');
    const viajePart = viajeId ? String(viajeId).padStart(10, '0') : '0000000000';
    const codigoVersion = `v${vehiculoPart}_${itemPart}_${viajePart}`;

    // 3. Buscar si ya existe documento con esta versión (Upsert logic)
    // Usamos el repositorio para buscar por version. (Asumimos que el metodo existe o lo implementaremos)
    // findByVersion requiere implementar. O usar findOne con query.
    // Usaremos create directamente si no hay manera, perooo el UNIQUE Index fallará.
    // Necesitamos verificar existencia.

    // REVISAR repo existente: findActive, findLastVersion... necesito findByContext(vehiculo, item, version)
    // Como no tengo ese metodo especifico, usare logica de "FindActive" y verificare si la version coincide? No.
    // Lo ideal seria que el repo exponga un metodo findByVersionString(vehiculo, item, version).

    // Asumiremos que crearemos un nuevo documento SIEMPRE Y CUANDO no exista.
    // Si existe, deberíamos actualizarlo (Delete items + Re-create items).
    // Para simplificar y no complicar el repo ahora mismo, intentaremos "Desactivar" lo anterior y "Crear" lo nuevo?
    // No, el Unique Index es sobre (Vehiculo, Item, Version). Si la Version es la MISMA, fallará.

    // Me arriesgaré a llamar un metodo 'deactivateByVersion' o similar?
    // Mejor: Obtener ID si existe.
    // En VehiculoChecklistDocumentRepository.ts (que no he editado), seguro usa drizzle.
    // Como soy el Service, no tengo acceso directo a Drizzle query builder (idealmente).
    // PERO, puedo usar `vehiculoChecklistDocumentRepository` methods.

    // Voy a implementar un "workaround" simple:
    // Capturar error de duplicidad? No, sucio.
    // Necesito modificar el REPOSITORIO para soportar 'findByVersion'.
    // Pero primero terminemos el Service asumiendo que el UPDATE reemplaza.

    // Como el usuario quiere "recuperar el ultimo", y la version es fija por viaje...
    // Significa que si edito el checklist del viaje, reemplazo el anterior.

    // Pseudo-logic:
    // const existing = await repo.findByVersion(vehiculoId, checklistItemId, codigoVersion);
    // if (existing) {
    //    repo.deleteItems(existing.id);
    //    repo.createItems(itemsWithDocId);
    //    return existing;
    // } else {
    //    create...
    // }

    // Necesito modificar el REPOSITORIO para añadir 'findByVersion' y 'deleteItems'.

    // For now, I will modify the SERVICE to use the new `version` string column logic.
    // And assume I will create the repository helper next.

    // NOTE: Replacing `createChecklistVersion` with this new logic.

    // Paso 2 (Real): Buscar existente
    const existingDoc = await this.vehiculoChecklistDocumentRepository.findByVersion(vehiculoId, data.checklistItemId, codigoVersion);

    let docId;
    if (existingDoc) {
      docId = existingDoc.id;
      // Actualizar items (Borrar y crear)
      await this.vehiculoChecklistDocumentRepository.deleteItems(docId);
      // Re-activar si estaba inactivo?
      if (!existingDoc.activo) {
        await this.vehiculoChecklistDocumentRepository.activate(docId);
      }
    } else {
      // Crear nuevo
      const newDoc = await this.vehiculoChecklistDocumentRepository.create({
        vehiculoId,
        checklistItemId: data.checklistItemId,
        version: codigoVersion, // STRING
        activo: true,
        viajeId: viajeId || null,
      });
      docId = newDoc.id;
    }

    // Insertar items
    const itemsWithDocId = data.items.map((item) => ({
      ...item,
      vehiculoChecklistDocumentId: docId,
    }));

    const savedItems = await this.vehiculoChecklistDocumentRepository.createItems(itemsWithDocId);

    // Gestionar ACTIVOS globales (solo si queremos mantener uno 'principal')
    // Si estamos editando un viaje especifico, ese se vuelve el activo?
    // Si, "ultimo recuperado".
    const activeDoc = await this.vehiculoChecklistDocumentRepository.findActive(vehiculoId, data.checklistItemId);
    if (activeDoc && activeDoc.id !== docId) {
      await this.vehiculoChecklistDocumentRepository.deactivate(activeDoc.id);
    }
    // Asegurar que el actual sea activo (ya lo hicimos arriba o en create)
    // Excepto si create no lo hizo activo explicitamente en DB? Default es true.

    return {
      id: docId,
      version: codigoVersion,
      items: savedItems,
    };
  }
}
