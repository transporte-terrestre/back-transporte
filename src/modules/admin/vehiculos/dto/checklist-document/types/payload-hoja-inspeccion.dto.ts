import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class HojaInspeccionDto {
  // DECLARACION JURADA DEL CONDUCTOR
  @ApiProperty({ description: 'He descansado lo suficiente y me encuentro en condiciones de conducir.', default: true })
  @IsBoolean()
  descansoSuficiente: boolean;

  @ApiProperty({ description: 'Me siento en buenas condiciones fisicas y no tengo ninguna dolencia o enfermedad.', default: true })
  @IsBoolean()
  condicionesFisicas: boolean;

  @ApiProperty({ description: 'Estoy tomando medicamentos recetados... no son impedimento para conducir.', default: true })
  @IsBoolean()
  medicamentos: boolean;

  @ApiProperty({ description: 'Me encuentro emocional y personalmente en buenas condiciones.', default: true })
  @IsBoolean()
  condicionesEmocionales: boolean;

  @ApiProperty({ description: 'Estoy consciente de la responsabilidad que significa conducir este vehículo.', default: true })
  @IsBoolean()
  conscienteResponsabilidad: boolean;

  // ESTADO GENERAL (vuelta del gallo)
  @ApiProperty({ description: 'Faros principales / Faros neblineros / Luces pirata', default: true })
  @IsBoolean()
  farosPrincipales: boolean;

  @ApiProperty({ description: 'Luces direccionales / de estacionamiento / intermitentes', default: true })
  @IsBoolean()
  lucesDireccionales: boolean;

  @ApiProperty({ description: 'Luces de freno/ Luces de retroceso', default: true })
  @IsBoolean()
  lucesFreno: boolean;

  @ApiProperty({ description: 'Luz estroboscópica(Circulina color verde)', default: true })
  @IsBoolean()
  luzEstroboscopica: boolean;

  @ApiProperty({ description: 'Espejos', default: true })
  @IsBoolean()
  espejos: boolean;

  @ApiProperty({ description: 'Parabrisa y ventanas (sin rajaduras)', default: true })
  @IsBoolean()
  parabrisasVentanas: boolean;

  @ApiProperty({ description: 'Plumillas Limpia y lava parabrisas', default: true })
  @IsBoolean()
  plumillas: boolean;

  @ApiProperty({ description: 'Neumáticos(Incluye repuesto ) tipo AT(Presión, banda de rodamiento)', default: true })
  @IsBoolean()
  neumaticos: boolean;

  @ApiProperty({ description: 'Esparragos, tuercas(torque según fabricante), seguro de tuercas', default: true })
  @IsBoolean()
  esparragosTuercas: boolean;

  @ApiProperty({ description: 'Cartolas /Letreros Identificatorios', default: true })
  @IsBoolean()
  cartolas: boolean;

  // Estado interno
  @ApiProperty({ description: 'Cinturones de seguridad / Estado', default: true })
  @IsBoolean()
  cinturonesEstado: boolean;

  @ApiProperty({ description: 'Alarma de Retroceso', default: true })
  @IsBoolean()
  alarmaRetroceso: boolean;

  @ApiProperty({ description: 'Seguros de puertas', default: true })
  @IsBoolean()
  segurosPuertas: boolean;

  @ApiProperty({ description: 'Claxon', default: true })
  @IsBoolean()
  claxon: boolean;

  @ApiProperty({ description: 'Tarjeta de propiedad, SOAT,Revisión Técnica vigente / ATS', default: true })
  @IsBoolean()
  documentosVigentes: boolean;

  @ApiProperty({ description: 'Kit básico de herramientas * / Llave de rueda tipo cruz', default: true })
  @IsBoolean()
  kitHerramientas: boolean;

  @ApiProperty({ description: 'Gata(Doble peso bruto vehículo) y sus accesorios', default: true })
  @IsBoolean()
  gata: boolean;

  @ApiProperty({ description: 'Orden y limpieza', default: true })
  @IsBoolean()
  ordenLimpieza: boolean;

  @ApiProperty({ description: 'Jaula Interna/Externa Antivuelco', default: true })
  @IsBoolean()
  jaulaAntivuelco: boolean;

  @ApiProperty({ description: 'Aire Acondicionado', default: true })
  @IsBoolean()
  aireAcondicionado: boolean;

  // Elementos de seguridad
  @ApiProperty({ description: 'Tacos/cuñas (02)', default: true })
  @IsBoolean()
  tacosCunas: boolean;

  @ApiProperty({ description: 'Conos de seguridad de 45 cm(03) con cinta reflectiva(8-10cm)', default: true })
  @IsBoolean()
  conosSeguridad: boolean;

  @ApiProperty({ description: 'Eslinga/Grilletes', default: true })
  @IsBoolean()
  eslingaGrilletes: boolean;

  @ApiProperty({ description: 'Pico y pala', default: true })
  @IsBoolean()
  picoPala: boolean;

  @ApiProperty({ description: 'Cable para pasar corriente', default: true })
  @IsBoolean()
  cableCorriente: boolean;

  @ApiProperty({ description: 'Extintor PQS 6kg (ABC)', default: true })
  @IsBoolean()
  extintor: boolean;

  @ApiProperty({ description: 'Botiquín * / Linterna', default: true })
  @IsBoolean()
  botiquinLinterna: boolean;

  @ApiProperty({ description: 'Kit antiderrame', default: true })
  @IsBoolean()
  kitAntiderrame: boolean;

  @ApiProperty({ description: 'Sistema Comunicación(Teléfono Satelital, Radio Handy, Celular)', default: true })
  @IsBoolean()
  sistemaComunicacion: boolean;

  // Estado mecánico
  @ApiProperty({ description: 'Prueba del freno de servicio', default: true })
  @IsBoolean()
  pruebaFrenoServicio: boolean;

  @ApiProperty({ description: 'Freno de estacionamiento', default: true })
  @IsBoolean()
  frenoEstacionamiento: boolean;

  @ApiProperty({ description: 'Dirección', default: true })
  @IsBoolean()
  direccion: boolean;

  @ApiProperty({ description: 'Nivel de aceite del motor', default: true })
  @IsBoolean()
  nivelAceiteMotor: boolean;

  @ApiProperty({ description: 'Nivel de liquido de frenos', default: true })
  @IsBoolean()
  nivelLiquidoFrenos: boolean;

  @ApiProperty({ description: 'Nivel de refrigerante', default: true })
  @IsBoolean()
  nivelRefrigerante: boolean;

  @ApiProperty({ description: 'Nivel de aceite hidráulico (hidrolina)', default: true })
  @IsBoolean()
  nivelAceiteHidraulico: boolean;

  @ApiProperty({ description: 'Nivel de agua para limpiaparabrisas', default: true })
  @IsBoolean()
  nivelAguaLimpiaparabrisas: boolean;

  @ApiProperty({ description: 'Otros (Mecánico)', default: false })
  @IsBoolean()
  otrosMecanico: boolean;

  // Sistemas Criticos / ADAS - Interruptores
  @ApiProperty({ description: 'MobiliEye', default: true })
  @IsBoolean()
  mobiliEye: boolean;

  @ApiProperty({ description: 'Sensor de Fatiga RDT401B (Sonido)', default: true })
  @IsBoolean()
  sensorFatiga: boolean;

  // Sistemas Criticos / ADAS - Sistema de Frenado
  @ApiProperty({ description: 'Frenos ABS', default: true })
  @IsBoolean()
  frenosABS: boolean;

  @ApiProperty({ description: 'ESP/ESC', default: true })
  @IsBoolean()
  espEsc: boolean;

  // Cinturones de Seguridad (Estado: Bueno vs Malo mapping can be simplified to boolean Checked/NotChecked or specific status)
  // Assuming simple boolean check for "Good" status as per general checklist pattern
  @ApiProperty({ description: 'Estado de Cinturones Pilotos', default: true })
  @IsBoolean()
  cinturonesPilotos: boolean;

  @ApiProperty({ description: 'Estado de Cinturones Pasajes', default: true })
  @IsBoolean()
  cinturonesPasajes: boolean;
}
