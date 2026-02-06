import { VehiculoChecklistDocumentItemCreateDto } from '../create-checklist-document.dto';
import { LucesEmergenciaAlarmasDto } from '../types/payload-luces-emergencia-alarmas.dto';
import { defineItem } from '../checklist.helper';

const items = [
  defineItem('Alarma de Retroceso', 1, { camposExtras: ['observacion'] }),
  defineItem('Alarma Cinturón de Seguridad', 2, { camposExtras: ['observacion'] }),
  defineItem('Claxon', 3, { camposExtras: ['observacion'] }),
  defineItem('Luces de la cabina conducción', 4, { camposExtras: ['observacion'] }),
  defineItem('Luces salón de pasajeros', 5, { camposExtras: ['observacion'] }),
  defineItem('Luces altas (lado derecho)', 6, { camposExtras: ['observacion'] }),
  defineItem('Luces altas (lado izquierdo)', 7, { camposExtras: ['observacion'] }),
  defineItem('Luces bajas (lado derecho)', 8, { camposExtras: ['observacion'] }),
  defineItem('Luces bajas (lado izquierdo)', 9, { camposExtras: ['observacion'] }),
  defineItem('Luces laterales (lado derecho)', 10, { camposExtras: ['observacion'] }),
  defineItem('Luces laterales (lado izquierdo)', 11, { camposExtras: ['observacion'] }),
  defineItem('Luces neblineros', 12, { camposExtras: ['observacion'] }),
  defineItem('Luces estacionamiento (lado derecho)', 13, { camposExtras: ['observacion'] }),
  defineItem('Luces estacionamiento (lado izquierdo)', 14, { camposExtras: ['observacion'] }),
  defineItem('Luces direccionales (lado derecho)', 15, { camposExtras: ['observacion'] }),
  defineItem('Luces direccionales (lado izquierdo)', 16, { camposExtras: ['observacion'] }),
  defineItem('Luz estroboscopica (circulina)', 17, { camposExtras: ['observacion'] }),
  defineItem('Luz de pertiga', 18, { camposExtras: ['observacion'] }),
  defineItem('Prueba de radio', 19, { camposExtras: ['observacion'] }),
  defineItem('Boton de panico', 20, { camposExtras: ['observacion'] }),
];

export type LucesEmergenciaAlarmasLabel = (typeof items)[number]['label'];

export const LucesEmergenciaAlarmasModel: VehiculoChecklistDocumentItemCreateDto[] = items;

export const LucesEmergenciaAlarmasMap: Record<LucesEmergenciaAlarmasLabel, keyof LucesEmergenciaAlarmasDto> = {
  'Alarma de Retroceso': 'alarmaRetroceso',
  'Alarma Cinturón de Seguridad': 'alarmaCinturon',
  'Claxon': 'claxon',
  'Luces de la cabina conducción': 'lucesCabina',
  'Luces salón de pasajeros': 'lucesSalon',
  'Luces altas (lado derecho)': 'lucesAltasDerecho',
  'Luces altas (lado izquierdo)': 'lucesAltasIzquierdo',
  'Luces bajas (lado derecho)': 'lucesBajasDerecho',
  'Luces bajas (lado izquierdo)': 'lucesBajasIzquierdo',
  'Luces laterales (lado derecho)': 'lucesLateralesDerecho',
  'Luces laterales (lado izquierdo)': 'lucesLateralesIzquierdo',
  'Luces neblineros': 'lucesNeblineros',
  'Luces estacionamiento (lado derecho)': 'lucesEstacionamientoDerecho',
  'Luces estacionamiento (lado izquierdo)': 'lucesEstacionamientoIzquierdo',
  'Luces direccionales (lado derecho)': 'lucesDireccionalesDerecho',
  'Luces direccionales (lado izquierdo)': 'lucesDireccionalesIzquierdo',
  'Luz estroboscopica (circulina)': 'luzEstroboscopica',
  'Luz de pertiga': 'luzPertiga',
  'Prueba de radio': 'pruebaRadio',
  'Boton de panico': 'botonPanico',
};
