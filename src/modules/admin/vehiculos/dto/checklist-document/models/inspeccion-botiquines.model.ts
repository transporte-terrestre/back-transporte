import { VehiculoChecklistDocumentItemCreateDto } from '../create-checklist-document.dto';
import { InspeccionBotiquinesDto } from '../types/payload-inspeccion-botiquines.dto';
import { defineItem } from '../checklist.helper';

const extraFields = ['fechaVencimiento', 'fechaSalida', 'fechaReposicion'];

const items = [
  defineItem('Alcohol de 70º 500ml', 1, { cantidad: '01 und', camposExtras: extraFields }),
  defineItem('Jabón líquido antiséptico 400ml', 2, { cantidad: '01 und', camposExtras: extraFields }),
  defineItem('Gasa esterilizada fraccionadas 10 x 10cm', 3, { cantidad: '20 und', camposExtras: extraFields }),
  defineItem('Apósito esterilizado 10x10cm', 4, { cantidad: '10 und', camposExtras: extraFields }),
  defineItem('Esparadrapo 2.5cm x 5m', 5, { cantidad: '02 und', camposExtras: extraFields }),
  defineItem('Venda elástica 4"x5yardas', 6, { cantidad: '02 und', camposExtras: extraFields }),
  defineItem('Banditas adhesivas (curitas)', 7, { cantidad: '20 und', camposExtras: extraFields }),
  defineItem('Tijera punta roma 3"', 8, { cantidad: '01 und', camposExtras: extraFields }),
  defineItem('Guantes quirúrgicos esterilizados 7 ½', 9, { cantidad: '02 pares', camposExtras: extraFields }),
  defineItem('Algodón 50 gr', 10, { cantidad: '01 und', camposExtras: extraFields }),
  defineItem('Maletín', 11, { cantidad: '01 und', camposExtras: extraFields }),
  // Para ubicación, pasamos undefined en metadatos y 'texto' como tipo
  defineItem('Ubicación del Botiquín', 12, undefined, 'texto'),
];

export type InspeccionBotiquinesLabel = (typeof items)[number]['label'];

export const InspeccionBotiquinesModel: VehiculoChecklistDocumentItemCreateDto[] = items;

export const InspeccionBotiquinesMap: Record<InspeccionBotiquinesLabel, keyof InspeccionBotiquinesDto> = {
  'Alcohol de 70º 500ml': 'alcohol',
  'Jabón líquido antiséptico 400ml': 'jabonLiquido',
  'Gasa esterilizada fraccionadas 10 x 10cm': 'gasaEsterilizada',
  'Apósito esterilizado 10x10cm': 'apositoEsterilizado',
  'Esparadrapo 2.5cm x 5m': 'esparadrapo',
  'Venda elástica 4"x5yardas': 'vendaElastica',
  'Banditas adhesivas (curitas)': 'banditasAdhesivas',
  'Tijera punta roma 3"': 'tijeraPuntaRoma',
  'Guantes quirúrgicos esterilizados 7 ½': 'guantesQuirurgicos',
  'Algodón 50 gr': 'algodon',
  Maletín: 'maletin',
  'Ubicación del Botiquín': 'ubicacionBotiquin',
};
