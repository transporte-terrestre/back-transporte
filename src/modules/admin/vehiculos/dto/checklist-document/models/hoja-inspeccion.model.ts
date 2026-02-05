import { VehiculoChecklistDocumentItemCreateDto } from '../create-checklist-document.dto';
import { HojaInspeccionDto } from '../types/hoja-inspeccion.dto';
import { defineItem } from '../checklist.helper';

const items = [
  // DECLARACION JURADA DEL CONDUCTOR
  defineItem('He descansado lo suficiente y me encuentro en condiciones de conducir.', 1),
  defineItem('Me siento en buenas condiciones fisicas y no tengo ninguna dolencia o enfermedad que me impida conducir en forma segura.', 2),
  defineItem('Estoy tomando medicamentos recetados por un médico quien me ha asegurado que no son impedimento para conducir de forma segura.', 3),
  defineItem('Me encuentro emocional y personalmente en buenas condiciones para poder concentrarme en la conducción segura del vehículo.', 4),
  defineItem('Estoy consciente de la responsabilidad que significa conducir este vehículo, sin poner en riesgo mi integridad, la de mis compañeros ni el patrimonio de la empresa .', 5),

  // ESTADO GENERAL (vuelta del gallo)
  defineItem('Faros principales / Faros neblineros / Luces pirata', 6),
  defineItem('Luces direccionales / de estacionamiento / intermitentes', 7),
  defineItem('Luces de freno/ Luces de retroceso', 8),
  defineItem('Luz estroboscópica(Circulina color verde)', 9),
  defineItem('Espejos', 10),
  defineItem('Parabrisa y ventanas (sin rajaduras)', 11),
  defineItem('Plumillas Limpia y lava parabrisas', 12),
  defineItem('Neumáticos(Incluye repuesto ) tipo AT(Presión, banda de rodamiento)', 13),
  defineItem('Esparragos, tuercas(torque según fabricante), seguro de tuercas', 14),
  defineItem('Cartolas /Letreros Identificatorios', 15),

  // Estado interno
  defineItem('Cinturones de seguridad / Estado', 16),
  defineItem('Alarma de Retroceso', 17),
  defineItem('Seguros de puertas', 18),
  defineItem('Claxon', 19),
  defineItem('Tarjeta de propiedad, SOAT,Revisión Técnica vigente / ATS', 20),
  defineItem('Kit básico de herramientas * / Llave de rueda tipo cruz', 21),
  defineItem('Gata(Doble peso bruto vehículo) y sus accesorios', 22),
  defineItem('Orden y limpieza', 23),
  defineItem('Jaula Interna/Externa Antivuelco', 24),
  defineItem('Aire Acondicionado', 25),

  // Elementos de seguridad
  defineItem('Tacos/cuñas (02)', 26),
  defineItem('Conos de seguridad de 45 cm(03) con cinta reflectiva(8-10cm)', 27),
  defineItem('Eslinga/Grilletes', 28),
  defineItem('Pico y pala', 29),
  defineItem('Cable para pasar corriente', 30),
  defineItem('Extintor PQS 6kg (ABC)', 31),
  defineItem('Botiquín * / Linterna', 32),
  defineItem('Kit antiderrame', 33),
  defineItem('Sistema Comunicación(Teléfono Satelital, Radio Handy, Celular)', 34),

  // Estado mecánico
  defineItem('Prueba del freno de servicio', 35),
  defineItem('Freno de estacionamiento', 36),
  defineItem('Dirección', 37),
  defineItem('Nivel de aceite del motor', 38),
  defineItem('Nivel de liquido de frenos', 39),
  defineItem('Nivel de refrigerante', 40),
  defineItem('Nivel de aceite hidráulico (hidrolina)', 41),
  defineItem('Nivel de agua para limpiaparabrisas', 42),
  defineItem('Otros', 43),

  // Sistemas Criticos / ADAS
  defineItem('MobiliEye', 44),
  defineItem('Sensor de Fatiga RDT401B (Sonido)', 45),
  defineItem('Frenos ABS', 46),
  defineItem('ESP/ESC', 47),

  // Cinturones de Seguridad
  defineItem('Estado de Cinturones Pilotos', 48),
  defineItem('Estado de Cinturones Pasajes', 49),
];

export type HojaInspeccionLabel = typeof items[number]['label'];

export const HojaInspeccionModel: VehiculoChecklistDocumentItemCreateDto[] = items;

export const HojaInspeccionMap: Record<HojaInspeccionLabel, keyof HojaInspeccionDto> = {
  'He descansado lo suficiente y me encuentro en condiciones de conducir.': 'descansoSuficiente',
  'Me siento en buenas condiciones fisicas y no tengo ninguna dolencia o enfermedad que me impida conducir en forma segura.': 'condicionesFisicas',
  'Estoy tomando medicamentos recetados por un médico quien me ha asegurado que no son impedimento para conducir de forma segura.': 'medicamentos',
  'Me encuentro emocional y personalmente en buenas condiciones para poder concentrarme en la conducción segura del vehículo.': 'condicionesEmocionales',
  'Estoy consciente de la responsabilidad que significa conducir este vehículo, sin poner en riesgo mi integridad, la de mis compañeros ni el patrimonio de la empresa .': 'conscienteResponsabilidad',
  'Faros principales / Faros neblineros / Luces pirata': 'farosPrincipales',
  'Luces direccionales / de estacionamiento / intermitentes': 'lucesDireccionales',
  'Luces de freno/ Luces de retroceso': 'lucesFreno',
  'Luz estroboscópica(Circulina color verde)': 'luzEstroboscopica',
  'Espejos': 'espejos',
  'Parabrisa y ventanas (sin rajaduras)': 'parabrisasVentanas',
  'Plumillas Limpia y lava parabrisas': 'plumillas',
  'Neumáticos(Incluye repuesto ) tipo AT(Presión, banda de rodamiento)': 'neumaticos',
  'Esparragos, tuercas(torque según fabricante), seguro de tuercas': 'esparragosTuercas',
  'Cartolas /Letreros Identificatorios': 'cartolas',
  'Cinturones de seguridad / Estado': 'cinturonesEstado',
  'Alarma de Retroceso': 'alarmaRetroceso',
  'Seguros de puertas': 'segurosPuertas',
  'Claxon': 'claxon',
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
  'Dirección': 'direccion',
  'Nivel de aceite del motor': 'nivelAceiteMotor',
  'Nivel de liquido de frenos': 'nivelLiquidoFrenos',
  'Nivel de refrigerante': 'nivelRefrigerante',
  'Nivel de aceite hidráulico (hidrolina)': 'nivelAceiteHidraulico',
  'Nivel de agua para limpiaparabrisas': 'nivelAguaLimpiaparabrisas',
  'Otros': 'otrosMecanico',
  'MobiliEye': 'mobiliEye',
  'Sensor de Fatiga RDT401B (Sonido)': 'sensorFatiga',
  'Frenos ABS': 'frenosABS',
  'ESP/ESC': 'espEsc',
  'Estado de Cinturones Pilotos': 'cinturonesPilotos',
  'Estado de Cinturones Pasajes': 'cinturonesPasajes',
};
