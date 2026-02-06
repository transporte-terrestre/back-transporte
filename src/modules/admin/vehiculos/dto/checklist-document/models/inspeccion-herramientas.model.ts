import { VehiculoChecklistDocumentItemCreateDto } from '../create-checklist-document.dto';
import { InspeccionHerramientasDto } from '../types/payload-inspeccion-herramientas.dto';
import { defineItem } from '../checklist.helper';

// Criterios A-F + Stock + Obs + ACCION
const extraFields = ['stock', 'criterioA', 'criterioB', 'criterioC', 'criterioD', 'criterioE', 'criterioF', 'accionCorrectiva', 'observacion'];

export const HerramientasInfo = {
  criterioA: 'HERRAMIENTA SIN GRASA IMPREGNADA',
  criterioB: 'EMPALME Y CONECCIONES',
  criterioC: 'ALMACENAMIENTO ADECUADO',
  criterioD: 'GOLPES Y ABOLLADURAS',
  criterioE: 'LIMPIA Y ORDENADA',
  criterioF: 'OTRO',
};

export const HerramientasSecciones = {
  info: 'Informacion',
  herramientas: 'Herramientas',
};

const items = [
  defineItem('Llaves Mixtas', 1, { cantidad: '14', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Destornillador Estrella', 2, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Destornillador Plano', 3, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Alicate', 4, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Llave de Rueda con Palanca', 5, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Triangulo de Seguridad', 6, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Conos de Peligro', 7, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Cable para Corriente', 8, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Eslinga', 9, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Grilletes', 10, { cantidad: '2', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Tacos Cuñas', 11, { cantidad: '2', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Linterna', 12, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Extintor', 13, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Pico', 14, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Medidor de Aire', 15, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Varas Luminosas Rojo y Verde', 16, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Paleta Pare y Siga', 17, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Escoba', 18, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Balde', 19, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Cuaderno Bitacora', 20, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Gata Hidraulica', 21, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
  defineItem('Caja o Maleta de Herramienta', 22, { cantidad: '1', medida: 'Unidad', camposExtras: extraFields }),
];

export type InspeccionHerramientasLabel = (typeof items)[number]['label'];

export const InspeccionHerramientasModel: VehiculoChecklistDocumentItemCreateDto[] = items;

export const InspeccionHerramientasMap: Record<InspeccionHerramientasLabel, keyof InspeccionHerramientasDto> = {
  'Llaves Mixtas': 'llavesMixtas',
  'Destornillador Estrella': 'destornilladorEstrella',
  'Destornillador Plano': 'destornilladorPlano',
  Alicate: 'alicate',
  'Llave de Rueda con Palanca': 'llaveRuedaPalanca',
  'Triangulo de Seguridad': 'trianguloSeguridad',
  'Conos de Peligro': 'conosPeligro',
  'Cable para Corriente': 'cableCorriente',
  Eslinga: 'eslinga',
  Grilletes: 'grilletes',
  'Tacos Cuñas': 'tacosCunas',
  Linterna: 'linterna',
  Extintor: 'extintor',
  Pico: 'pico',
  'Medidor de Aire': 'medidorAire',
  'Varas Luminosas Rojo y Verde': 'varasLuminosas',
  'Paleta Pare y Siga': 'paletaPareSiga',
  Escoba: 'escoba',
  Balde: 'balde',
  'Cuaderno Bitacora': 'cuadernoBitacora',
  'Gata Hidraulica': 'gataHidraulica',
  'Caja o Maleta de Herramienta': 'cajaHerramientas',
};
