import { VehiculoChecklistDocumentItemCreateDto } from '../create-checklist-document.dto';
import { KitAntiderramesDto } from '../types/payload-kit-antiderrames.dto';
import { defineItem } from '../checklist.helper';

const items = [
  defineItem('Mazo de goma', 1, { cantidad: '01 und' }),
  defineItem('Set de cuñas, tarugos, tacos, conos por 10 und de distinto tamaño', 2, { cantidad: '01 set' }),
  defineItem('Bandeja', 3, { cantidad: '01 und' }),
  defineItem('Barreras en Tela Oleofilica de 3 pulgadas de diámetro x 1.20 m de largo Material Hidrofobico', 4, {
    cantidad: '02 und',
  }),
  defineItem('Cinta de seguridad color rojo', 5, { cantidad: '30 m' }),
  defineItem('Cinta de seguridad color amarillo', 6, { cantidad: '30 m' }),
  defineItem('Bolsas de color rojo de tipo industrial', 7, { cantidad: '2 und' }),
  defineItem('Paños oleofilicos de 40 cm x 50 cm', 8, { cantidad: '30 paños' }),
  defineItem('Recogedor de plástico', 9, { cantidad: '01 und' }),
  defineItem('Manual de plan de contingencia', 10, { cantidad: '01 und' }),
  defineItem('Guantes de nitrilo', 11, { cantidad: '01 par' }),
  defineItem('Lente de seguridad', 12, { cantidad: '01 und' }),
  defineItem('Respirador Doble Cartucho para vapores orgánicos (Safety Goggle)', 13, { cantidad: '01 und' }),
  defineItem('Traje tyvek resistente a hidrocarburos (de la talla adecuada para el transportista)', 14, {
    cantidad: '01 und',
  }),
  defineItem('Botas de PVC con puntera de seguridad', 15, { cantidad: '01 und' }),
  defineItem('Maletín', 16, { cantidad: '01 und' }),
  defineItem('UBICACIÓN', 17, undefined, 'texto'),
];

export type KitAntiderramesLabel = (typeof items)[number]['label'];

export const KitAntiderramesModel: VehiculoChecklistDocumentItemCreateDto[] = items;

export const KitAntiderramesMap: Record<KitAntiderramesLabel, keyof KitAntiderramesDto> = {
  'Mazo de goma': 'mazoGoma',
  'Set de cuñas, tarugos, tacos, conos por 10 und de distinto tamaño': 'setCunas',
  Bandeja: 'bandeja',
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
  Maletín: 'maletin',
  UBICACIÓN: 'ubicacion',
};
