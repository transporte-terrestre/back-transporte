import { VehiculoChecklistDocumentItemUpsertDto } from '../upsert-checklist-document.dto';
import { HojaInspeccionDto } from '../types/payload-hoja-inspeccion.dto';
import { defineItem } from '../checklist.helper';

export const HojaSecciones = {
  declaracionJurada: 'DECLARACION JURADA DEL CONDUCTOR',
  estadoGeneral: 'ESTADO GENERAL (vuelta del gallo)',
  estadoInterno: 'Estado interno',
  elementosSeguridad: 'Elementos de seguridad',
  estadoMecanico: 'Estado mecánico',
  sistemasCriticos: 'Sistemas Criticos / ADAS',
  cinturonesSeguridad: 'Cinturones de Seguridad',
};

type SeccionKey = keyof typeof HojaSecciones;

const items = [
  // DECLARACION JURADA DEL CONDUCTOR
  defineItem('He descansado lo suficiente y me encuentro en condiciones de conducir.', 1, { color: 'rojo', seccion: 'declaracionJurada' }),
  defineItem('Me siento en buenas condiciones fisicas y no tengo ninguna dolencia o enfermedad que me impida conducir en forma segura.', 2, {
    color: 'rojo',
    seccion: 'declaracionJurada',
  }),
  defineItem('Estoy tomando medicamentos recetados por un médico quien me ha asegurado que no son impedimento para conducir de forma segura.', 3, {
    color: 'rojo',
    seccion: 'declaracionJurada',
  }),
  defineItem('Me encuentro emocional y personalmente en buenas condiciones para poder concentrarme en la conducción segura del vehículo.', 4, {
    color: 'rojo',
    seccion: 'declaracionJurada',
  }),
  defineItem(
    'Estoy consciente de la responsabilidad que significa conducir este vehículo, sin poner en riesgo mi integridad, la de mis compañeros ni el patrimonio de la empresa .',
    5,
    { color: 'rojo', seccion: 'declaracionJurada' },
  ),

  // ESTADO GENERAL (vuelta del gallo)
  defineItem('Faros principales / Faros neblineros / Luces pirata', 6, { color: 'amarillo', seccion: 'estadoGeneral' }),
  defineItem('Luces direccionales / de estacionamiento / intermitentes', 7, { color: 'amarillo', seccion: 'estadoGeneral' }),
  defineItem('Luces de freno/ Luces de retroceso', 8, { color: 'amarillo', seccion: 'estadoGeneral' }),
  defineItem('Luz estroboscópica(Circulina color verde)', 9, { color: 'amarillo', seccion: 'estadoGeneral' }),
  defineItem('Espejos', 10, { color: 'amarillo', seccion: 'estadoGeneral' }),
  defineItem('Parabrisa y ventanas (sin rajaduras)', 11, { color: 'amarillo', seccion: 'estadoGeneral' }),
  defineItem('Plumillas Limpia y lava parabrisas', 12, { color: 'amarillo', seccion: 'estadoGeneral' }),
  defineItem('Neumáticos(Incluye repuesto ) tipo AT(Presión, banda de rodamiento)', 13, { color: 'amarillo', seccion: 'estadoGeneral' }),
  defineItem('Esparragos, tuercas(torque según fabricante), seguro de tuercas', 14, { color: 'amarillo', seccion: 'estadoGeneral' }),
  defineItem('Cartolas /Letreros Identificatorios', 15, { color: 'verde', seccion: 'estadoGeneral' }),

  // Estado interno
  defineItem('Cinturones de seguridad / Estado', 16, { color: 'rojo', seccion: 'estadoInterno' }),
  defineItem('Alarma de Retroceso', 17, { color: 'amarillo', seccion: 'estadoInterno' }),
  defineItem('Seguros de puertas', 18, { color: 'amarillo', seccion: 'estadoInterno' }),
  defineItem('Claxon', 19, { color: 'amarillo', seccion: 'estadoInterno' }),
  defineItem('Tarjeta de propiedad, SOAT,Revisión Técnica vigente / ATS', 20, { color: 'verde', seccion: 'estadoInterno' }),
  defineItem('Kit básico de herramientas * / Llave de rueda tipo cruz', 21, { color: 'verde', seccion: 'estadoInterno' }),
  defineItem('Gata(Doble peso bruto vehículo) y sus accesorios', 22, { color: 'verde', seccion: 'estadoInterno' }),
  defineItem('Orden y limpieza', 23, { color: 'verde', seccion: 'estadoInterno' }),
  defineItem('Jaula Interna/Externa Antivuelco', 24, { color: 'rojo', seccion: 'estadoInterno' }),
  defineItem('Aire Acondicionado', 25, { color: 'amarillo', seccion: 'estadoInterno' }),

  // Elementos de seguridad
  defineItem('Tacos/cuñas (02)', 26, { color: 'verde', seccion: 'elementosSeguridad' }),
  defineItem('Conos de seguridad de 45 cm(03) con cinta reflectiva(8-10cm)', 27, { color: 'verde', seccion: 'elementosSeguridad' }),
  defineItem('Eslinga/Grilletes', 28, { color: 'verde', seccion: 'elementosSeguridad' }),
  defineItem('Pico y pala', 29, { color: 'verde', seccion: 'elementosSeguridad' }),
  defineItem('Cable para pasar corriente', 30, { color: 'verde', seccion: 'elementosSeguridad' }),
  defineItem('Extintor PQS 6kg (ABC)', 31, { color: 'verde', seccion: 'elementosSeguridad' }),
  defineItem('Botiquín * / Linterna', 32, { color: 'verde', seccion: 'elementosSeguridad' }),
  defineItem('Kit antiderrame', 33, { color: 'verde', seccion: 'elementosSeguridad' }),
  defineItem('Sistema Comunicación(Teléfono Satelital, Radio Handy, Celular)', 34, { color: 'verde', seccion: 'elementosSeguridad' }),

  // Estado mecánico
  defineItem('Prueba del freno de servicio', 35, { color: 'rojo', seccion: 'estadoMecanico' }),
  defineItem('Freno de estacionamiento', 36, { color: 'rojo', seccion: 'estadoMecanico' }),
  defineItem('Dirección', 37, { color: 'rojo', seccion: 'estadoMecanico' }),
  defineItem('Nivel de aceite del motor', 38, { color: 'rojo', seccion: 'estadoMecanico' }),
  defineItem('Nivel de liquido de frenos', 39, { color: 'rojo', seccion: 'estadoMecanico' }),
  defineItem('Nivel de refrigerante', 40, { color: 'rojo', seccion: 'estadoMecanico' }),
  defineItem('Nivel de aceite hidráulico (hidrolina)', 41, { color: 'rojo', seccion: 'estadoMecanico' }),
  defineItem('Nivel de agua para limpiaparabrisas', 42, { color: 'verde', seccion: 'estadoMecanico' }),
  defineItem('Otros', 43, { color: 'verde', seccion: 'estadoMecanico' }),

  // Sistemas Criticos / ADAS
  defineItem('MobiliEye', 44, { color: 'rojo', seccion: 'sistemasCriticos' }),
  defineItem('Sensor de Fatiga RDT401B (Sonido)', 45, { color: 'rojo', seccion: 'sistemasCriticos' }),
  defineItem('Frenos ABS', 46, { color: 'rojo', seccion: 'sistemasCriticos' }),
  defineItem('ESP/ESC', 47, { color: 'rojo', seccion: 'sistemasCriticos' }),

  // Cinturones de Seguridad
  defineItem('Estado de Cinturones Pilotos', 48, { color: 'rojo', seccion: 'cinturonesSeguridad' }),
  defineItem('Estado de Cinturones Pasajes', 49, { color: 'rojo', seccion: 'cinturonesSeguridad' }),
];

export type HojaInspeccionLabel = (typeof items)[number]['label'];

export const HojaInspeccionModel: VehiculoChecklistDocumentItemUpsertDto[] = items;

export const HojaInspeccionMap: Record<HojaInspeccionLabel, keyof HojaInspeccionDto> = {
  'He descansado lo suficiente y me encuentro en condiciones de conducir.': 'descansoSuficiente',
  'Me siento en buenas condiciones fisicas y no tengo ninguna dolencia o enfermedad que me impida conducir en forma segura.': 'condicionesFisicas',
  'Estoy tomando medicamentos recetados por un médico quien me ha asegurado que no son impedimento para conducir de forma segura.': 'medicamentos',
  'Me encuentro emocional y personalmente en buenas condiciones para poder concentrarme en la conducción segura del vehículo.':
    'condicionesEmocionales',
  'Estoy consciente de la responsabilidad que significa conducir este vehículo, sin poner en riesgo mi integridad, la de mis compañeros ni el patrimonio de la empresa .':
    'conscienteResponsabilidad',
  'Faros principales / Faros neblineros / Luces pirata': 'farosPrincipales',
  'Luces direccionales / de estacionamiento / intermitentes': 'lucesDireccionales',
  'Luces de freno/ Luces de retroceso': 'lucesFreno',
  'Luz estroboscópica(Circulina color verde)': 'luzEstroboscopica',
  Espejos: 'espejos',
  'Parabrisa y ventanas (sin rajaduras)': 'parabrisasVentanas',
  'Plumillas Limpia y lava parabrisas': 'plumillas',
  'Neumáticos(Incluye repuesto ) tipo AT(Presión, banda de rodamiento)': 'neumaticos',
  'Esparragos, tuercas(torque según fabricante), seguro de tuercas': 'esparragosTuercas',
  'Cartolas /Letreros Identificatorios': 'cartolas',
  'Cinturones de seguridad / Estado': 'cinturonesEstado',
  'Alarma de Retroceso': 'alarmaRetroceso',
  'Seguros de puertas': 'segurosPuertas',
  Claxon: 'claxon',
  'Tarjeta de propiedad, SOAT,Revisión Técnica vigente / ATS': 'documentosVigentes',
  'Kit básico de herramientas * / Llave de rueda tipo cruz': 'kitHerramientas',
  'Gata(Doble peso bruto vehículo) y sus accesorios': 'gata',
  'Orden y limpieza': 'ordenLimpieza',
  'Jaula Interna/Externa Antivuelco': 'jaulaAntivuelco',
  'Aire Acondicionado': 'aireAcondicionado',
  'Tacos/cuñas (02)': 'tacosCunas',
  'Conos de seguridad de 45 cm(03) con cinta reflectiva(8-10cm)': 'conosSeguridad',
  'Eslinga/Grilletes': 'eslingaGrilletes',
  'Pico y pala': 'picoPala',
  'Cable para pasar corriente': 'cableCorriente',
  'Extintor PQS 6kg (ABC)': 'extintor',
  'Botiquín * / Linterna': 'botiquinLinterna',
  'Kit antiderrame': 'kitAntiderrame',
  'Sistema Comunicación(Teléfono Satelital, Radio Handy, Celular)': 'sistemaComunicacion',
  'Prueba del freno de servicio': 'pruebaFrenoServicio',
  'Freno de estacionamiento': 'frenoEstacionamiento',
  Dirección: 'direccion',
  'Nivel de aceite del motor': 'nivelAceiteMotor',
  'Nivel de liquido de frenos': 'nivelLiquidoFrenos',
  'Nivel de refrigerante': 'nivelRefrigerante',
  'Nivel de aceite hidráulico (hidrolina)': 'nivelAceiteHidraulico',
  'Nivel de agua para limpiaparabrisas': 'nivelAguaLimpiaparabrisas',
  Otros: 'otrosMecanico',
  MobiliEye: 'mobiliEye',
  'Sensor de Fatiga RDT401B (Sonido)': 'sensorFatiga',
  'Frenos ABS': 'frenosABS',
  'ESP/ESC': 'espEsc',
  'Estado de Cinturones Pilotos': 'cinturonesPilotos',
  'Estado de Cinturones Pasajes': 'cinturonesPasajes',
};
