import { VehiculoChecklistDocumentItemCreateDto } from '../create-checklist-document.dto';
import { KitAntiderramesDto } from '../types/kit-antiderrames.dto';
import { defineItem } from '../checklist.helper';

const extraFields = ['observacion', 'fechaVencimiento']; // Estandarizado, aunque imagen no lo muestre explícitamente, es útil.

const items = [
  defineItem('Mazo de goma', 1, { cantidad: '01 und', camposExtras: extraFields }),
  defineItem('Set de cuñas, tarugos, tacos, conos por 10 und de distinto tamaño', 2, { cantidad: '01 set', camposExtras: extraFields }),
  defineItem('Bandeja', 3, { cantidad: '01 und', camposExtras: extraFields }),
  defineItem('Barreras en Tela Oleofilica de 3 pulgadas de diámetro x 1.20 m de largo Material Hidrofobico', 4, {
    cantidad: '02 und',
    camposExtras: extraFields,
  }),
  defineItem('Cinta de seguridad color rojo', 5, { cantidad: '30 m', camposExtras: extraFields }),
  defineItem('Cinta de seguridad color amarillo', 6, { cantidad: '30 m', camposExtras: extraFields }),
  defineItem('Bolsas de color rojo de tipo industrial', 7, { cantidad: '2 und', camposExtras: extraFields }),
  defineItem('Paños oleofilicos de 40 cm x 50 cm', 8, { cantidad: '30 paños', camposExtras: extraFields }),
  defineItem('Recogedor de plástico', 9, { cantidad: '01 und', camposExtras: extraFields }),
  defineItem('Manual de plan de contingencia', 10, { cantidad: '01 und', camposExtras: extraFields }),
  defineItem('Guantes de nitrilo', 11, { cantidad: '01 par', camposExtras: extraFields }),
  defineItem('Lente de seguridad', 12, { cantidad: '01 und', camposExtras: extraFields }),
  defineItem('Respirador Doble Cartucho para vapores orgánicos (Safety Goggle)', 13, { cantidad: '01 und', camposExtras: extraFields }),
  defineItem('Traje tyvek resistente a hidrocarburos (de la talla adecuada para el transportista)', 14, {
    cantidad: '01 und',
    camposExtras: extraFields,
  }),
  defineItem('Botas de PVC con puntera de seguridad', 15, { cantidad: '01 und', camposExtras: extraFields }),
  defineItem('Maletín', 16, { cantidad: '01 und', camposExtras: extraFields }),
  defineItem('UBICACIÓN', 17, undefined, 'texto'),
];

export type KitAntiderramesLabel = (typeof items)[number]['label'];

export const KitAntiderramesModel: VehiculoChecklistDocumentItemCreateDto[] = items;

export const KitAntiderramesMap: Record<KitAntiderramesLabel, keyof KitAntiderramesDto> = {
  'Mazo de goma': 'mazoGoma',
  'Set de cuñas, tarugos, tacos, conos por 10 und de distinto tamaño': 'setCunas',
  'Bandeja': 'bandeja',
  'Barreras en Tela Oleofilica de 3 pulgadas de diámetro x 1.20 m de largo Material Hidrofobico': 'barrerasOleofilicas',
  'Cinta de seguridad color rojo': 'cintaRoja',
  'Cinta de seguridad color amarillo': 'cintaAmarilla',
  'Bolsas de color rojo de tipo industrial': 'bolsasRojas',
  'Paños oleofilicos de 40 cm x 50 cm': 'panosOleofilicos',
  'Recogedor de plástico': 'recogedorPlastico',
  'Manual de plan de contingencia': 'manualContingencia',
  'Guantes de nitrilo': 'guantesNitrilo',
  'Lente de seguridad': 'lenteSeguridad',
  'Respirador Doble Cartucho para vapores orgánicos (Safety Goggle)': 'respirador',
  'Traje tyvek resistente a hidrocarburos (de la talla adecuada para el transportista)': 'trajeTyvek',
  'Botas de PVC con puntera de seguridad': 'botasPVC',
  'Maletín': 'maletin',
  'UBICACIÓN': 'ubicacion',
};
