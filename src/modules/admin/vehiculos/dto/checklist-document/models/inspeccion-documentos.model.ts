import { VehiculoChecklistDocumentItemUpsertDto } from '../upsert-checklist-document.dto';
import { InspeccionDocumentosDto } from '../types/payload-inspeccion-documentos.dto';
import { defineItem } from '../checklist.helper';

const extraFields = ['observacion', 'fechaVencimiento'];

export const DocumentosSecciones = {
  documentosVehiculo: 'DOCUMENTOS DEL VEHICULO',
  documentosConductor: 'DOCUMENTOS DEL CONDUCTOR',
};

const items = [
  // DOCUMENTOS DEL VEHICULO
  defineItem('El SOAT se encuentra en la unidad y se encuentra vigente', 1, { camposExtras: extraFields, seccion: 'documentosVehiculo' }),
  defineItem('La Tarjeta de Propiedad se encuentra en el vehículo', 2, { camposExtras: extraFields, seccion: 'documentosVehiculo' }),
  defineItem('La Tarjeta de Circulación se encuentra en el vehículo y está vigente', 3, {
    camposExtras: extraFields,
    seccion: 'documentosVehiculo',
  }),
  defineItem('La Póliza se encuentra en el vehículo y se encuentra vigente', 4, { camposExtras: extraFields, seccion: 'documentosVehiculo' }),
  defineItem('El CTIV se encuentra en el vehículo y se encuentra vigente', 5, { camposExtras: extraFields, seccion: 'documentosVehiculo' }),
  defineItem('Se cuenta con las Hojas MSDS de los productos químicos', 6, { camposExtras: extraFields, seccion: 'documentosVehiculo' }),
  defineItem('Se cuenta con el Manual de Operación del Vehículo', 7, { camposExtras: extraFields, seccion: 'documentosVehiculo' }),
  defineItem('Otro (Vehículo)', 8, { camposExtras: extraFields, seccion: 'documentosVehiculo' }),

  // DOCUMENTOS DEL CONDUCTOR
  defineItem('El Conductor cuenta con Licencia del MTC vigente', 9, { camposExtras: extraFields, seccion: 'documentosConductor' }),
  defineItem('El Conductor cuenta con su Licencia Interna de Manejo vigente', 10, { camposExtras: extraFields, seccion: 'documentosConductor' }),
  defineItem('El Conductor cuenta con el Check List Diario firmado por el Supervisor de Operaciones', 11, {
    camposExtras: extraFields,
    seccion: 'documentosConductor',
  }),
  defineItem('El Conductor cuenta con el IPERC BASE y el Iperc Continúo firmado por el Supervisor/Coordinador de Operaciones', 12, {
    camposExtras: extraFields,
    seccion: 'documentosConductor',
  }),
  defineItem('El Conductor cuenta con el PETS correspondiente de su Actividad/Tarea', 13, {
    camposExtras: extraFields,
    seccion: 'documentosConductor',
  }),
  defineItem('Se cuenta con las Hojas MSDS de los productos químicos (Conductor)', 14, {
    camposExtras: extraFields,
    seccion: 'documentosConductor',
  }),
  defineItem('Se cuenta con el mapa de riesgos - Rutas', 15, { camposExtras: extraFields, seccion: 'documentosConductor' }),
  defineItem('Otro (Conductor)', 16, { camposExtras: extraFields, seccion: 'documentosConductor' }),
];

export type InspeccionDocumentosLabel = (typeof items)[number]['label'];

export const InspeccionDocumentosModel: VehiculoChecklistDocumentItemUpsertDto[] = items;

export const InspeccionDocumentosMap: Record<InspeccionDocumentosLabel, keyof InspeccionDocumentosDto> = {
  'El SOAT se encuentra en la unidad y se encuentra vigente': 'soatVigente',
  'La Tarjeta de Propiedad se encuentra en el vehículo': 'tarjetaPropiedad',
  'La Tarjeta de Circulación se encuentra en el vehículo y está vigente': 'tarjetaCirculacion',
  'La Póliza se encuentra en el vehículo y se encuentra vigente': 'polizaVigente',
  'El CTIV se encuentra en el vehículo y se encuentra vigente': 'ctivVigente',
  'Se cuenta con las Hojas MSDS de los productos químicos': 'hojasMsdsVehiculo',
  'Se cuenta con el Manual de Operación del Vehículo': 'manualOperacion',
  'Otro (Vehículo)': 'otroVehiculo',
  'El Conductor cuenta con Licencia del MTC vigente': 'licenciaMtc',
  'El Conductor cuenta con su Licencia Interna de Manejo vigente': 'licenciaInterna',
  'El Conductor cuenta con el Check List Diario firmado por el Supervisor de Operaciones': 'checkListDiario',
  'El Conductor cuenta con el IPERC BASE y el Iperc Continúo firmado por el Supervisor/Coordinador de Operaciones': 'iperc',
  'El Conductor cuenta con el PETS correspondiente de su Actividad/Tarea': 'pets',
  'Se cuenta con las Hojas MSDS de los productos químicos (Conductor)': 'hojasMsdsConductor',
  'Se cuenta con el mapa de riesgos - Rutas': 'mapaRiesgos',
  'Otro (Conductor)': 'otroConductor',
};
