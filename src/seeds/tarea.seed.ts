import { database } from "@db/connection.db";
import { tareas } from "@model/tables/tarea.model";

export async function seedTareas() {
  console.log("🌱 Seeding tasks catalog...");

  const tareasData = await database
    .insert(tareas)
    .values([
  // Motor
  { codigo: "TRB-001", nombreTrabajo: "Implementar Unidad", grupo: "motor" },

  // Radiotransmisor
  { codigo: "TRB-002", nombreTrabajo: "Revisar Radio transmisor", grupo: "radiotransmisor" },

  // Freno de servicio
  { codigo: "TRB-003", nombreTrabajo: "Regular Frenos", grupo: "freno de servicio" },

  // Barras de direccion
  { codigo: "TRB-004", nombreTrabajo: "Cambiar Terminal de barra corta de direccion  Lado Derecho", grupo: "barras de direccion" },

  // Bateria
  { codigo: "TRB-005", nombreTrabajo: "Cambiar Baterias", grupo: "bateria" },

  // Sistema electrico
  { codigo: "TRB-006", nombreTrabajo: "Revisar Sistema Electrico", grupo: "sistema electrico" },

  // Ruedas
  { codigo: "TRB-007", nombreTrabajo: "Rotar Neumatico", grupo: "ruedas" },

  // Alumbrado
  { codigo: "TRB-008", nombreTrabajo: "Revisar Testigos de Tablero", grupo: "alumbrado" },

  // Motor
  { codigo: "TRB-009", nombreTrabajo: "Escanear Unidad", grupo: "motor" },

  // Servicios de lubricacion
  { codigo: "TRB-010", nombreTrabajo: "Revisar Nivel de aceite de motor", grupo: "servicios de lubricacion" },
  { codigo: "TRB-011", nombreTrabajo: "Revisar Nivel de lubricantes", grupo: "servicios de lubricacion" },

  // Sistema de refrigeracion
  { codigo: "TRB-012", nombreTrabajo: "Revisar Nivel del refriguerante", grupo: "sistema de refrigeracion" },

  // Admision y escape
  { codigo: "TRB-013", nombreTrabajo: "Limpiar Filtro de Aire", grupo: "admision y escape" },

  // Ruedas
  { codigo: "TRB-014", nombreTrabajo: "Revisar Neumaticos", grupo: "ruedas" },

  // Arbol de transmision
  { codigo: "TRB-015", nombreTrabajo: "Cambiar Jebe de cardan de fuerza", grupo: "arbol de transmision" },
  { codigo: "TRB-016", nombreTrabajo: "Cambiar Rodajes de Soporte de Cardan de fuerza", grupo: "arbol de transmision" },

  // Sistema electrico
  { codigo: "TRB-017", nombreTrabajo: "Realizar Inspeccion electrica", grupo: "sistema electrico" },

  // Servicios de mantenimiento
  { codigo: "TRB-018", nombreTrabajo: "Realizar Inspeccion mecanica", grupo: "servicios de mantenimiento" },

  // Servicios de lubricacion
  { codigo: "TRB-019", nombreTrabajo: "Realizar Inspeccion tecnica", grupo: "servicios de lubricacion" },

  // Ruedas
  { codigo: "TRB-020", nombreTrabajo: "Verificar Ajuste de tuerca de perno de rueda con Torquimetro", grupo: "ruedas" },

  // Alumbrado
  { codigo: "TRB-021", nombreTrabajo: "Revisar Luces en General", grupo: "alumbrado" },

  // Servicios de mantenimiento
  { codigo: "TRB-022", nombreTrabajo: "Revisar Fajas en General", grupo: "servicios de mantenimiento" },

  // Suspension
  { codigo: "TRB-023", nombreTrabajo: "Revisar Suspension  Posterior", grupo: "suspension" },
  { codigo: "TRB-024", nombreTrabajo: "Revisar Suspension  Delantera", grupo: "suspension" },

  // Embrague
  { codigo: "TRB-025", nombreTrabajo: "Revisar Sistema de embrague", grupo: "embrague" },

  // Freno de servicio
  { codigo: "TRB-026", nombreTrabajo: "Revisar Sistema de frenos", grupo: "freno de servicio" },

  // Ruedas
  { codigo: "TRB-027", nombreTrabajo: "Revisar Sistema de Direccion", grupo: "ruedas" },

  // Sistema de lubricacion
  { codigo: "TRB-028", nombreTrabajo: "Cambiar Anillos de Tapon de Carter", grupo: "sistema de lubricacion" },

  // Valvulas de aire comprimido
  { codigo: "TRB-029", nombreTrabajo: "Cambiar Filtro de Secador de Aire", grupo: "valvulas de aire comprimido" },

  // Sistema de refrigeracion
  { codigo: "TRB-030", nombreTrabajo: "Cambiar Refrigerante", grupo: "sistema de refrigeracion" },

  // Admision y escape
  { codigo: "TRB-031", nombreTrabajo: "Cambiar Filtro de Aire Secundario", grupo: "admision y escape" },
  { codigo: "TRB-032", nombreTrabajo: "Cambiar Filtro de Aire Primario", grupo: "admision y escape" },

  // Sistema de alimentacion
  { codigo: "TRB-033", nombreTrabajo: "Cambiar Filtro separador de agua", grupo: "sistema de alimentacion" },

  // Sistema de lubricacion
  { codigo: "TRB-034", nombreTrabajo: "Cambiar Filtro de aceite de motor", grupo: "sistema de lubricacion" },

  // Servicios de lubricacion
  { codigo: "TRB-035", nombreTrabajo: "Cambiar Aceite de motor", grupo: "servicios de lubricacion" },

  // Pms
  { codigo: "TRB-036", nombreTrabajo: "Realizar Plan de Mantenimiento 4", grupo: "pms" },

  // Ruedas
  { codigo: "TRB-037", nombreTrabajo: "Cambiar Neumatico 1", grupo: "ruedas" },
  { codigo: "TRB-038", nombreTrabajo: "Cambiar Neumatico 2", grupo: "ruedas" },

  // Barras estabilizadoras
  { codigo: "TRB-039", nombreTrabajo: "Cambiar Jebes de Barra Estabilizadora Delantera derecha", grupo: "barras estabilizadoras" },
  { codigo: "TRB-040", nombreTrabajo: "Cambiar Jebes de Barra Estabilizadora Posterior izquierda", grupo: "barras estabilizadoras" },

  // Alumbrado
  { codigo: "TRB-041", nombreTrabajo: "Cambiar Foco de faro delantero", grupo: "alumbrado" },

  // Caja de cambios
  { codigo: "TRB-042", nombreTrabajo: "Revisar Caja de cambios", grupo: "caja de cambios" },

  // Componentes de mando electrico
  { codigo: "TRB-043", nombreTrabajo: "Cambiar Panel Multiplex - Luces Interiores", grupo: "componentes de mando electrico" },

  // Asientos
  { codigo: "TRB-044", nombreTrabajo: "Revisar Asientos del salon", grupo: "asientos" },

  // Herramientas
  { codigo: "TRB-045", nombreTrabajo: "Recargar Extintor", grupo: "herramientas" },

  // Puertas
  { codigo: "TRB-046", nombreTrabajo: "Revisar Puerta principal", grupo: "puertas" },
  { codigo: "TRB-047", nombreTrabajo: "Reparar Puerta principal", grupo: "puertas" },

  // Freno de servicio
  { codigo: "TRB-048", nombreTrabajo: "Limpiar Zapatas de freno  Posterior", grupo: "freno de servicio" },
  { codigo: "TRB-049", nombreTrabajo: "Limpiar Zapatas de freno  Delantero", grupo: "freno de servicio" },
  { codigo: "TRB-050", nombreTrabajo: "Remachar Zapatas de freno", grupo: "freno de servicio" },

  // Forros y pastillas
  { codigo: "TRB-051", nombreTrabajo: "Cambiar Forros de zapatas de freno Posterior izquierdo", grupo: "forros y pastillas" },
  { codigo: "TRB-052", nombreTrabajo: "Cambiar Forros de zapatas de freno Posterior derecho", grupo: "forros y pastillas" },
  { codigo: "TRB-053", nombreTrabajo: "Cambiar Forros de zapatas de freno Delantero izquierdo", grupo: "forros y pastillas" },
  { codigo: "TRB-054", nombreTrabajo: "Cambiar Forros de zapatas de freno Delantero derecho", grupo: "forros y pastillas" },

  // Freno de servicio
  { codigo: "TRB-055", nombreTrabajo: "Cambiar Tambor de freno Delantero izquierdo", grupo: "freno de servicio" },
  { codigo: "TRB-056", nombreTrabajo: "Cambiar Tambor de freno Delantero derecho", grupo: "freno de servicio" },
  { codigo: "TRB-057", nombreTrabajo: "Revisar Tambor de freno posterior izquierdo.", grupo: "freno de servicio" },
  { codigo: "TRB-058", nombreTrabajo: "Revisar Tambor de freno posterior derecho", grupo: "freno de servicio" },
  { codigo: "TRB-059", nombreTrabajo: "Revisar Tambor de freno delantero izquierdo", grupo: "freno de servicio" },
  { codigo: "TRB-060", nombreTrabajo: "Revisar Tambor de freno delantero derecho", grupo: "freno de servicio" },

  // Ruedas
  { codigo: "TRB-061", nombreTrabajo: "Revisar Zapatas", grupo: "ruedas" },
  { codigo: "TRB-062", nombreTrabajo: "Cambiar Piton de rueda", grupo: "ruedas" },
  { codigo: "TRB-063", nombreTrabajo: "Cambiar Extension de valvula de camara", grupo: "ruedas" },
  { codigo: "TRB-064", nombreTrabajo: "Cambiar Valvula de rueda 4", grupo: "ruedas" },

  // Palancas de frenos
  { codigo: "TRB-065", nombreTrabajo: "Cambiar Rachet de freno Delantero derecho", grupo: "palancas de frenos" },
  { codigo: "TRB-066", nombreTrabajo: "Cambiar Rachet de freno Delantero izquierdo", grupo: "palancas de frenos" },

  // Barras estabilizadoras
  { codigo: "TRB-067", nombreTrabajo: "Cambiar Jebes de Barra Estabilizadora Delantera izquierda", grupo: "barras estabilizadoras" },

  // Pms
  { codigo: "TRB-068", nombreTrabajo: "Realizar Plan de Mantenimiento 3", grupo: "pms" },

  // Sistema de alimentacion
  { codigo: "TRB-069", nombreTrabajo: "Cambiar Filtro de combustible", grupo: "sistema de alimentacion" },

  // Servicios de lubricacion
  { codigo: "TRB-070", nombreTrabajo: "Cambiar Aceite de corona", grupo: "servicios de lubricacion" },
  { codigo: "TRB-071", nombreTrabajo: "Cambiar Aceite de caja de cambios", grupo: "servicios de lubricacion" },
  { codigo: "TRB-072", nombreTrabajo: "Engrasar Unidad en general", grupo: "servicios de lubricacion" },

  // Freno de servicio
  { codigo: "TRB-073", nombreTrabajo: "Revisar Sistema ABS", grupo: "freno de servicio" },

  // Sistema de refrigeracion
  { codigo: "TRB-074", nombreTrabajo: "Revisar Sistema de Refrigeracion", grupo: "sistema de refrigeracion" },

  // Video
  { codigo: "TRB-075", nombreTrabajo: "Cambiar Monitor de TV", grupo: "video" },

  // Sistema de refrigeracion
  { codigo: "TRB-076", nombreTrabajo: "Rectificar Damper", grupo: "sistema de refrigeracion" },

  // Equipos interiores
  { codigo: "TRB-077", nombreTrabajo: "Reparar Soporte de Cortina", grupo: "equipos interiores" },

  // Aire acondicionado
  { codigo: "TRB-078", nombreTrabajo: "Revisar Aire acondicionado", grupo: "aire acondicionado" },

  // Equipos interiores
  { codigo: "TRB-079", nombreTrabajo: "Cambiar Malla a paqueteras", grupo: "equipos interiores" },
  { codigo: "TRB-080", nombreTrabajo: "Instalar Malla a paqueteras", grupo: "equipos interiores" },

  // Ruedas
  { codigo: "TRB-081", nombreTrabajo: "Reparar Neumatico 4", grupo: "ruedas" },

  // Alumbrado
  { codigo: "TRB-082", nombreTrabajo: "Cambiar Faro de Luz de Placa", grupo: "alumbrado" },
  { codigo: "TRB-083", nombreTrabajo: "Reparar Faro delantero lado izquierdo", grupo: "alumbrado" },

  // Cubiertas
  { codigo: "TRB-084", nombreTrabajo: "Cambiar Soporte de espejo retrovisor Izquierdo", grupo: "cubiertas" },

  // Caja de cambios
  { codigo: "TRB-085", nombreTrabajo: "Revisar Sensor de Caja de cambios", grupo: "caja de cambios" },

  // Alumbrado
  { codigo: "TRB-086", nombreTrabajo: "Reparar Faros posteriores", grupo: "alumbrado" },
  { codigo: "TRB-087", nombreTrabajo: "Cambiar Faro  Posterior derecho", grupo: "alumbrado" },

  // Suspension
  { codigo: "TRB-088", nombreTrabajo: "Cambiar Topes de suspension", grupo: "suspension" },

  // Ruedas
  { codigo: "TRB-089", nombreTrabajo: "Cambiar Rodaje de rueda Posterior derecha", grupo: "ruedas" },
  { codigo: "TRB-090", nombreTrabajo: "Cambiar Reten de rueda Posterior derecha", grupo: "ruedas" },

  // Servicios de mantenimiento
  { codigo: "TRB-091", nombreTrabajo: "Cambiar Faja de Compresor", grupo: "servicios de mantenimiento" },

  // Techo
  { codigo: "TRB-092", nombreTrabajo: "Sellar Techo", grupo: "techo" },

  // Ruedas
  { codigo: "TRB-093", nombreTrabajo: "Cambiar Neumatico 3", grupo: "ruedas" },
  { codigo: "TRB-094", nombreTrabajo: "Cambiar Neumatico 4", grupo: "ruedas" },
  { codigo: "TRB-095", nombreTrabajo: "Cambiar Neumatico 5", grupo: "ruedas" },
  { codigo: "TRB-096", nombreTrabajo: "Cambiar Neumatico 6", grupo: "ruedas" },

  // Palancas de frenos
  { codigo: "TRB-097", nombreTrabajo: "Cambiar Rachet de freno Posterior izquierdo", grupo: "palancas de frenos" },

  // Caja de direccion
  { codigo: "TRB-098", nombreTrabajo: "Revisar Fuga de ATF al sistema de direccion", grupo: "caja de direccion" },
  { codigo: "TRB-099", nombreTrabajo: "Cambiar Caja principal de direccion", grupo: "caja de direccion" },

  // Servo direccion
  { codigo: "TRB-100", nombreTrabajo: "Cambiar Manguera ATF de Direccion", grupo: "servo direccion" },

  // Caja de direccion
  { codigo: "TRB-101", nombreTrabajo: "Rellenar ATF al Sistema de direccion", grupo: "caja de direccion" },

  // Alumbrado
  { codigo: "TRB-102", nombreTrabajo: "Cambiar Pastilla de Faro Neblinero", grupo: "alumbrado" },

  // Pms
  { codigo: "TRB-103", nombreTrabajo: "Realizar Plan de Mantenimiento 6", grupo: "pms" },

  // Caja de direccion
  { codigo: "TRB-104", nombreTrabajo: "Cambiar ATF al Sistema de direccion", grupo: "caja de direccion" },

  // Servo direccion
  { codigo: "TRB-105", nombreTrabajo: "Cambiar Filtro de ATF al sistema de dirección", grupo: "servo direccion" },

  // Forros y pastillas
  { codigo: "TRB-106", nombreTrabajo: "Cambiar Remache de forro de zapata de freno delantero Derecho", grupo: "forros y pastillas" },
  { codigo: "TRB-107", nombreTrabajo: "Cambiar Remache de forro de zapata de freno delantero Izquierdo", grupo: "forros y pastillas" },
  { codigo: "TRB-108", nombreTrabajo: "Cambiar Remache de forro de zapata de freno posterior Derecho", grupo: "forros y pastillas" },
  { codigo: "TRB-109", nombreTrabajo: "Cambiar Remache de forro de zapata de freno posterior Izquierdo", grupo: "forros y pastillas" },

  // Ruedas
  { codigo: "TRB-110", nombreTrabajo: "Reparar Neumatico 5", grupo: "ruedas" },

  // Componentes de mando electrico
  { codigo: "TRB-111", nombreTrabajo: "Cambiar Chapa de Arranque", grupo: "componentes de mando electrico" },

  // Equipos interiores
  { codigo: "TRB-112", nombreTrabajo: "Colacar Elastico a paqueteras", grupo: "equipos interiores" },

  // Calefaccion
  { codigo: "TRB-113", nombreTrabajo: "Reparar Desempañador", grupo: "calefaccion" },

  // Alumbrado
  { codigo: "TRB-114", nombreTrabajo: "Cambiar Faro Neblinero", grupo: "alumbrado" },
  { codigo: "TRB-115", nombreTrabajo: "Cambiar Faro de luz de freno", grupo: "alumbrado" },

  // Componentes de mando electrico
  { codigo: "TRB-116", nombreTrabajo: "Cambiar Sensor de rueda ABS delantero lado derecho", grupo: "componentes de mando electrico" },

  // Sistema de refrigeracion
  { codigo: "TRB-117", nombreTrabajo: "Rellenar Refrigerante", grupo: "sistema de refrigeracion" },
  { codigo: "TRB-118", nombreTrabajo: "Cambiar Manguera de agua", grupo: "sistema de refrigeracion" },

  // Alternador de aire acondicionado
  { codigo: "TRB-119", nombreTrabajo: "Revisar Fajas de Alternador de aire acondicionado.", grupo: "alternador de aire acondicionado" },

  // Video
  { codigo: "TRB-120", nombreTrabajo: "Instalar Video Camaras Grabador", grupo: "video" },

  // Servicios de mantenimiento
  { codigo: "TRB-121", nombreTrabajo: "Instalar Sistema Antifatiga", grupo: "servicios de mantenimiento" },

  // Amortiguadores
  { codigo: "TRB-122", nombreTrabajo: "Cambiar Amortiguador Posterior izquierdo", grupo: "amortiguadores" },

  // Alumbrado
  { codigo: "TRB-123", nombreTrabajo: "Pulir Mica de faro delantero Derecho", grupo: "alumbrado" },
  { codigo: "TRB-124", nombreTrabajo: "Pulir Mica de faro delantero Izquierdo", grupo: "alumbrado" },

  // Ruedas
  { codigo: "TRB-125", nombreTrabajo: "Medir Altura de la cocada de neumaticos", grupo: "ruedas" },

  // Freno de servicio
  { codigo: "TRB-126", nombreTrabajo: "Cambiar Tambor de freno Posterior derecho", grupo: "freno de servicio" },
  { codigo: "TRB-127", nombreTrabajo: "Cambiar Tambor de freno Posterior izquierdo", grupo: "freno de servicio" },

  // Componentes electronicos auxiliares
  { codigo: "TRB-128", nombreTrabajo: "Instalar Cargador de USB", grupo: "componentes electronicos auxiliares" },

  // Sistema de aire comprimido
  { codigo: "TRB-129", nombreTrabajo: "Revisar Fuga de Aire", grupo: "sistema de aire comprimido" },

  // Asientos
  { codigo: "TRB-130", nombreTrabajo: "Cambiar Cinturon de seguridad", grupo: "asientos" },

  // Puertas
  { codigo: "TRB-131", nombreTrabajo: "Reparar Estribo de puerta principal", grupo: "puertas" },

  // Admision y escape
  { codigo: "TRB-132", nombreTrabajo: "Cambiar Turbocompresor", grupo: "admision y escape" },

  // Suspension de ballestas
  { codigo: "TRB-133", nombreTrabajo: "Cambiar Jebes de Paquete de Muelle Delantero izquierdo", grupo: "suspension de ballestas" },

  // Alternador
  { codigo: "TRB-134", nombreTrabajo: "Cambiar Faja de Alternador", grupo: "alternador" },

  // Puertas
  { codigo: "TRB-135", nombreTrabajo: "Cambiar Seguro de puerta de salon", grupo: "puertas" },

  // Alumbrado
  { codigo: "TRB-136", nombreTrabajo: "Cambiar Foco de faro posterior", grupo: "alumbrado" },
  { codigo: "TRB-137", nombreTrabajo: "Cambiar Faro de luces de castillo", grupo: "alumbrado" },

  // Asientos
  { codigo: "TRB-138", nombreTrabajo: "Revisar Cinturon de seguridad", grupo: "asientos" },

  // Sistema de refrigeracion
  { codigo: "TRB-139", nombreTrabajo: "Revisar Fuga de agua", grupo: "sistema de refrigeracion" },
  { codigo: "TRB-140", nombreTrabajo: "Cambiar Tanque de expansion", grupo: "sistema de refrigeracion" },

  // Servicios de lubricacion
  { codigo: "TRB-141", nombreTrabajo: "Revisar Fuga de aceite de motor", grupo: "servicios de lubricacion" },

  // Ruedas
  { codigo: "TRB-142", nombreTrabajo: "Cambiar Trabatuercas de rueda delantera derecha", grupo: "ruedas" },
  { codigo: "TRB-143", nombreTrabajo: "Cambiar Trabatuercas de rueda delantera izquierda", grupo: "ruedas" },
  { codigo: "TRB-144", nombreTrabajo: "Cambiar Trabatuercas de rueda posterior derecha", grupo: "ruedas" },

  // Admision y escape
  { codigo: "TRB-145", nombreTrabajo: "Revisar Turbocompresor", grupo: "admision y escape" },

  // Alumbrado
  { codigo: "TRB-146", nombreTrabajo: "Regular Faros Neblineros", grupo: "alumbrado" },

  // Componentes de mando electrico
  { codigo: "TRB-147", nombreTrabajo: "Instalar Transformador de Corriente de 12V", grupo: "componentes de mando electrico" },
  { codigo: "TRB-148", nombreTrabajo: "Revisar Equipo GPS", grupo: "componentes de mando electrico" },

  // Herramientas
  { codigo: "TRB-149", nombreTrabajo: "Colocar Caja de herramientas", grupo: "herramientas" },

  // Admision y escape
  { codigo: "TRB-150", nombreTrabajo: "Adaptar Toma de Aire", grupo: "admision y escape" },
  { codigo: "TRB-151", nombreTrabajo: "Cambiar Soporte de silenciador de tubo de escape", grupo: "admision y escape" },

  // Estructuras
  { codigo: "TRB-152", nombreTrabajo: "Sellar Carroceria", grupo: "estructuras" },

  // Servicios de mantenimiento
  { codigo: "TRB-153", nombreTrabajo: "Rellenar Liquido Adblue", grupo: "servicios de mantenimiento" },

  // Condensador
  { codigo: "TRB-154", nombreTrabajo: "Realizar Mantenimiento al condensador de Aire Acondicionado", grupo: "condensador" },

  // Evaporador
  { codigo: "TRB-155", nombreTrabajo: "Realizar Mantenimiento al evaporador de aire acondicionado", grupo: "evaporador" },

  // Aire acondicionado
  { codigo: "TRB-156", nombreTrabajo: "Limpiar Filtro de Aire Acondicionado", grupo: "aire acondicionado" },

  // Compresor de aire acondicionado
  { codigo: "TRB-157", nombreTrabajo: "Cambiar Rodaje de polea de compresor de aire acondicionado", grupo: "compresor de aire acondicionado" },
  { codigo: "TRB-158", nombreTrabajo: "Realizar Mantenimiento de compresor de Aire Acondicionado.", grupo: "compresor de aire acondicionado" },
  { codigo: "TRB-159", nombreTrabajo: "Cambiar Faja de Compresor de aire acondicionado", grupo: "compresor de aire acondicionado" },

  // Calefaccion
  { codigo: "TRB-160", nombreTrabajo: "Revisar Sistema de Calefaccion", grupo: "calefaccion" },

  // Ruedas
  { codigo: "TRB-161", nombreTrabajo: "Instalar Tapas a Pitones de aros de ruedas", grupo: "ruedas" },

  // Alumbrado
  { codigo: "TRB-162", nombreTrabajo: "Cambiar Focos de Luces de Pasadizo", grupo: "alumbrado" },

  // Compresor
  { codigo: "TRB-163", nombreTrabajo: "Cambiar Valvula de compresor", grupo: "compresor" },

  // Servicios de mantenimiento
  { codigo: "TRB-164", nombreTrabajo: "Realizar Servicio de Mantenimiento Contrato por KM", grupo: "servicios de mantenimiento" },

  // Suspension neumatica
  { codigo: "TRB-165", nombreTrabajo: "Cambiar Bolsa de suspension Posterior derecha", grupo: "suspension neumatica" },

  // Claxon
  { codigo: "TRB-166", nombreTrabajo: "Revisar Claxon electrico", grupo: "claxon" },

  // Pms
  { codigo: "TRB-167", nombreTrabajo: "Realizar Plan de Mantenimiento 5", grupo: "pms" },

  // Servicios de lubricacion
  { codigo: "TRB-168", nombreTrabajo: "Rellenar Lubricante de ralentizador", grupo: "servicios de lubricacion" },

  // Amortiguadores
  { codigo: "TRB-169", nombreTrabajo: "Cambiar Amortiguador de bodega", grupo: "amortiguadores" },

  // Embrague
  { codigo: "TRB-170", nombreTrabajo: "Regular Pedal de Embrague", grupo: "embrague" },

  // Asientos
  { codigo: "TRB-171", nombreTrabajo: "Cambiar Amortiguador de asiento de salon", grupo: "asientos" },

  // Calefaccion
  { codigo: "TRB-172", nombreTrabajo: "Cambiar Manguera de Calefacción", grupo: "calefaccion" },

  // Ruedas
  { codigo: "TRB-173", nombreTrabajo: "Realizar Mantenimiento de rueda posterior izquierda", grupo: "ruedas" },
  { codigo: "TRB-174", nombreTrabajo: "Cambiar Reten de rueda Posterior izquierda", grupo: "ruedas" },

  // Alumbrado
  { codigo: "TRB-175", nombreTrabajo: "Revisar Luces  de Carretera", grupo: "alumbrado" },

  // Sistema de alimentacion
  { codigo: "TRB-176", nombreTrabajo: "Revisar Fuga de combustible por la base de los filtros", grupo: "sistema de alimentacion" },

  // Admision y escape
  { codigo: "TRB-177", nombreTrabajo: "Cambiar Base de Filtro de Aire", grupo: "admision y escape" },

  // Puertas
  { codigo: "TRB-178", nombreTrabajo: "Cambiar Piston de puerta de principal", grupo: "puertas" },

  // Estructuras
  { codigo: "TRB-179", nombreTrabajo: "Reparar Soporte de Monitor de TV", grupo: "estructuras" },
  { codigo: "TRB-180", nombreTrabajo: "Ajustar Espejos retrovisores", grupo: "estructuras" },

  // Admision y escape
  { codigo: "TRB-181", nombreTrabajo: "Revisar Filtro de Aire", grupo: "admision y escape" },

  // Sistema de alimentacion
  { codigo: "TRB-182", nombreTrabajo: "Revisar Filtros de combustible", grupo: "sistema de alimentacion" },

  // Componentes de mando electrico
  { codigo: "TRB-183", nombreTrabajo: "Revisar Palanca de Cambio de Luces", grupo: "componentes de mando electrico" },

  // Alumbrado
  { codigo: "TRB-184", nombreTrabajo: "Cambiar Faro pirata", grupo: "alumbrado" },

  // Arrancador
  { codigo: "TRB-185", nombreTrabajo: "Reparar Chapa de Contacto", grupo: "arrancador" },

  // Palancas de frenos
  { codigo: "TRB-186", nombreTrabajo: "Revisar Rachets de freno Posterior derecho", grupo: "palancas de frenos" },
  { codigo: "TRB-187", nombreTrabajo: "Revisar Rachets de freno Posterior izquierdo", grupo: "palancas de frenos" },

  // Servicios de mantenimiento
  { codigo: "TRB-188", nombreTrabajo: "Realizar Prueba de Unidad en Ruta", grupo: "servicios de mantenimiento" },

  // Ruedas
  { codigo: "TRB-189", nombreTrabajo: "Realizar inversion de flanco de neumatico", grupo: "ruedas" },

  // Sistema de alimentacion
  { codigo: "TRB-190", nombreTrabajo: "Limpiar Filtro separador de agua", grupo: "sistema de alimentacion" },
  { codigo: "TRB-191", nombreTrabajo: "Revisar Boya del tanque de combustible", grupo: "sistema de alimentacion" },

  // Cubiertas
  { codigo: "TRB-192", nombreTrabajo: "Reparar Espejo retrovisor Derecho", grupo: "cubiertas" },

  // Ruedas
  { codigo: "TRB-193", nombreTrabajo: "Balancear Rueda", grupo: "ruedas" },
  { codigo: "TRB-194", nombreTrabajo: "Cambiar Pernos de rueda Posterior izquierda", grupo: "ruedas" },
  { codigo: "TRB-195", nombreTrabajo: "Cambiar Tuercas de rueda Posterior izquierda", grupo: "ruedas" },

  // Bodegas
  { codigo: "TRB-196", nombreTrabajo: "Reparar Puerta de bodega", grupo: "bodegas" },

  // Ruedas
  { codigo: "TRB-197", nombreTrabajo: "Alinear Sistema de Direccion", grupo: "ruedas" },

  // Motor
  { codigo: "TRB-198", nombreTrabajo: "Revisar Perdida de potencia de Motor", grupo: "motor" },

  // Condensador
  { codigo: "TRB-199", nombreTrabajo: "Soldar Condensador de Aire Acondicionado.", grupo: "condensador" },

  // Cigüeñal
  { codigo: "TRB-200", nombreTrabajo: "Cambiar Damper de cigueñal", grupo: "cigüeñal" },

  // Servicios de lubricacion
  { codigo: "TRB-201", nombreTrabajo: "Rellenar Aceite de motor", grupo: "servicios de lubricacion" },

  // Ruedas
  { codigo: "TRB-202", nombreTrabajo: "Cambiar Trabatuercas de rueda posterior izquierda", grupo: "ruedas" },
  { codigo: "TRB-203", nombreTrabajo: "Cambiar Rodaje de rueda Delantera izquierda", grupo: "ruedas" },
  { codigo: "TRB-204", nombreTrabajo: "Cambiar Rodaje de rueda Delantera derecha", grupo: "ruedas" },

  // Arbol de transmision
  { codigo: "TRB-205", nombreTrabajo: "Cambiar Soporte de Cardan de fuerza", grupo: "arbol de transmision" },

  // Ruedas
  { codigo: "TRB-206", nombreTrabajo: "Cambiar Reten de rueda Delantera derecha", grupo: "ruedas" },
  { codigo: "TRB-207", nombreTrabajo: "Cambiar Reten de rueda Delantera izquierda", grupo: "ruedas" },
  { codigo: "TRB-208", nombreTrabajo: "Realizar Mantenimiento de rueda delantera derecha", grupo: "ruedas" },
  { codigo: "TRB-209", nombreTrabajo: "Realizar Mantenimiento de rueda delantera izquierda", grupo: "ruedas" },

  // Vidrios y ventanas
  { codigo: "TRB-210", nombreTrabajo: "Reparar Vidrio de ventana Lateral derecha", grupo: "vidrios y ventanas" },
  { codigo: "TRB-211", nombreTrabajo: "Reparar Vidrio de ventana Lateral izquierda", grupo: "vidrios y ventanas" },

  // Mecanismos limpia y lava parabrisas
  { codigo: "TRB-212", nombreTrabajo: "Cambiar Plumillas de Limpiaparabrisas Izquierdo", grupo: "mecanismos limpia y lava parabrisas" },
  { codigo: "TRB-213", nombreTrabajo: "Cambiar Plumillas de Limpiaparabrisas Derecho", grupo: "mecanismos limpia y lava parabrisas" },

  // Ruedas
  { codigo: "TRB-214", nombreTrabajo: "Revisar Rueda Posterior derecha", grupo: "ruedas" },
  { codigo: "TRB-215", nombreTrabajo: "Cambiar Neumatico usado 2", grupo: "ruedas" },

  // Equipos interiores
  { codigo: "TRB-216", nombreTrabajo: "Instalar Monitor de Camaras", grupo: "equipos interiores" },

  // Cubiertas
  { codigo: "TRB-217", nombreTrabajo: "Cambiar Cinta reflectiva", grupo: "cubiertas" },

  // Suspension de ballestas
  { codigo: "TRB-218", nombreTrabajo: "Desmontar Muelles posterior  Izquierdo", grupo: "suspension de ballestas" },
  { codigo: "TRB-219", nombreTrabajo: "Revisar Muelles Posterior izquierdo", grupo: "suspension de ballestas" },

  // Ruedas
  { codigo: "TRB-220", nombreTrabajo: "Reparar Neumatico 1", grupo: "ruedas" },
  { codigo: "TRB-221", nombreTrabajo: "Medir Presion de neumaticos", grupo: "ruedas" },
  { codigo: "TRB-222", nombreTrabajo: "Reparar Neumatico 2", grupo: "ruedas" },

  // Lineas de gas refrigerante
  { codigo: "TRB-223", nombreTrabajo: "Cargar Gas Refrigerante", grupo: "lineas de gas refrigerante" },

  // Componentes electronicos auxiliares
  { codigo: "TRB-224", nombreTrabajo: "Cambiar Cargador usb", grupo: "componentes electronicos auxiliares" },

  // Video
  { codigo: "TRB-225", nombreTrabajo: "Reparar Monitor de TV", grupo: "video" },

  // Suspension neumatica
  { codigo: "TRB-226", nombreTrabajo: "Revisar Bolsas de suspension", grupo: "suspension neumatica" },
  { codigo: "TRB-227", nombreTrabajo: "Cambiar Bolsa de suspension Posterior izquierda", grupo: "suspension neumatica" },

  // Video
  { codigo: "TRB-228", nombreTrabajo: "Reparar DVD", grupo: "video" },

  // Audio
  { codigo: "TRB-229", nombreTrabajo: "Revisar Sistema de Audio y Video", grupo: "audio" },

  // Alternador
  { codigo: "TRB-230", nombreTrabajo: "Revisar Alternador P1", grupo: "alternador" },
  { codigo: "TRB-231", nombreTrabajo: "Revisar Alternador P2", grupo: "alternador" },

  // Pms
  { codigo: "TRB-232", nombreTrabajo: "Realizar Plan de Mantenimiento 1", grupo: "pms" },

  // Sistema de refrigeracion
  { codigo: "TRB-233", nombreTrabajo: "Cambiar Tapa de tanque de expansion", grupo: "sistema de refrigeracion" },

  // Baño
  { codigo: "TRB-234", nombreTrabajo: "Cambiar Extractor de Aire de Baño", grupo: "baño" },

  // Cubiertas
  { codigo: "TRB-235", nombreTrabajo: "Cambiar Cable de capot", grupo: "cubiertas" },

  // Componentes de mando electrico
  { codigo: "TRB-236", nombreTrabajo: "Cambiar Alarma de Retroceso", grupo: "componentes de mando electrico" },

  // Cubiertas
  { codigo: "TRB-237", nombreTrabajo: "Cambiar Soporte de espejo retrovisor Derecho", grupo: "cubiertas" },
  { codigo: "TRB-238", nombreTrabajo: "Cambiar Pernos base de espejo retrovisor Izquierdo", grupo: "cubiertas" },

  // Servicios de mantenimiento
  { codigo: "TRB-239", nombreTrabajo: "Realizar Servicio de mantenimiento", grupo: "servicios de mantenimiento" },

  // Motor
  { codigo: "TRB-240", nombreTrabajo: "Limpiar Purificador centrifugo de aceite de motor", grupo: "motor" },

  // Alternador de aire acondicionado
  { codigo: "TRB-241", nombreTrabajo: "Cambiar Fajas de Alternador de aire acondicionado.", grupo: "alternador de aire acondicionado" },

  // Baño
  { codigo: "TRB-242", nombreTrabajo: "Calibrar Sensor de baño", grupo: "baño" },
  { codigo: "TRB-243", nombreTrabajo: "Revisar Sistema de Baño", grupo: "baño" },

  // Sistema de lubricacion
  { codigo: "TRB-244", nombreTrabajo: "Reparar Protector de carter de aceite de motor", grupo: "sistema de lubricacion" },

  // Instrumentos
  { codigo: "TRB-245", nombreTrabajo: "Revisar Reloj de Nivel de Combustible", grupo: "instrumentos" },

  // Salon
  { codigo: "TRB-246", nombreTrabajo: "Revisar Ventanas de Salon", grupo: "salon" },

  // Alumbrado
  { codigo: "TRB-247", nombreTrabajo: "Cambiar Faro  Posterior izquierdo", grupo: "alumbrado" },

  // Motor
  { codigo: "TRB-248", nombreTrabajo: "Revisar Soportes de motor", grupo: "motor" },

  // Video
  { codigo: "TRB-249", nombreTrabajo: "Revisar camara 1", grupo: "video" },

  // Asientos
  { codigo: "TRB-250", nombreTrabajo: "Cambiar Codera de asiento", grupo: "asientos" },

  // Suspension de ballestas
  { codigo: "TRB-251", nombreTrabajo: "Revisar Barra estabilizadora delantera", grupo: "suspension de ballestas" },

  // Alternador
  { codigo: "TRB-252", nombreTrabajo: "Revisar Fajas de Alternador", grupo: "alternador" },

  // Puertas
  { codigo: "TRB-253", nombreTrabajo: "Cambiar Cremallera de puerta de piloto", grupo: "puertas" },

  // Admision y escape
  { codigo: "TRB-254", nombreTrabajo: "Soldar Tubo de Escape", grupo: "admision y escape" },

  // Servicios de lubricacion
  { codigo: "TRB-255", nombreTrabajo: "Cambiar Lubricante de ralentizador", grupo: "servicios de lubricacion" },

  // Freno hidraulico
  { codigo: "TRB-256", nombreTrabajo: "Cambiar Filtro de ralentizador", grupo: "freno hidraulico" },

  // Servicios de lubricacion
  { codigo: "TRB-257", nombreTrabajo: "Cambiar Filtro de aceite de caja de cambios", grupo: "servicios de lubricacion" },

  // Servicios de mantenimiento
  { codigo: "TRB-258", nombreTrabajo: "Cambiar Filtro de Adblue", grupo: "servicios de mantenimiento" },

  // Servicios de lubricacion
  { codigo: "TRB-259", nombreTrabajo: "Cambiar Filtro de aceite de corona", grupo: "servicios de lubricacion" },

  // Bateria
  { codigo: "TRB-260", nombreTrabajo: "Cambiar Liquido de Bateria", grupo: "bateria" },

  // Alumbrado
  { codigo: "TRB-261", nombreTrabajo: "Revisar Luces de Salon", grupo: "alumbrado" },

  // Componentes electronicos auxiliares
  { codigo: "TRB-262", nombreTrabajo: "Revisar cargadores USB", grupo: "componentes electronicos auxiliares" },

  // Estructuras
  { codigo: "TRB-263", nombreTrabajo: "Reparar Carroceria Derecha", grupo: "estructuras" },

  // Vidrios y ventanas
  { codigo: "TRB-264", nombreTrabajo: "Cambiar Vinil", grupo: "vidrios y ventanas" },

  // Alternador
  { codigo: "TRB-265", nombreTrabajo: "Cambiar Alternador P1", grupo: "alternador" },

  // Estructuras
  { codigo: "TRB-266", nombreTrabajo: "Pintar Carroceria", grupo: "estructuras" },

  // Componentes de mando electrico
  { codigo: "TRB-267", nombreTrabajo: "Cambiar Multiplex de tablero", grupo: "componentes de mando electrico" },
  { codigo: "TRB-268", nombreTrabajo: "Cambiar Modulo ECU EMS ASSY S6 DC13 107 Scania.", grupo: "componentes de mando electrico" },
  { codigo: "TRB-269", nombreTrabajo: "Programar modulo.", grupo: "componentes de mando electrico" },

  // Mecanismos limpia y lava parabrisas
  { codigo: "TRB-270", nombreTrabajo: "Revisar Sistema de limpiaparabrisas", grupo: "mecanismos limpia y lava parabrisas" },

  // Freno hidraulico
  { codigo: "TRB-271", nombreTrabajo: "Revisar Retarder", grupo: "freno hidraulico" },

  // Suspension neumatica
  { codigo: "TRB-272", nombreTrabajo: "Cambiar Bolsa de suspension Delantera derecha", grupo: "suspension neumatica" },
  { codigo: "TRB-273", nombreTrabajo: "Cambiar Bolsa de suspension Delantera izquierda", grupo: "suspension neumatica" },

  // Cabina
  { codigo: "TRB-274", nombreTrabajo: "Reparar Interior de cabina", grupo: "cabina" },

  // Barras de direccion
  { codigo: "TRB-275", nombreTrabajo: "Revisar Barras de Direccion", grupo: "barras de direccion" },

  // Baño
  { codigo: "TRB-276", nombreTrabajo: "Realizar Mantenimiento a Sistema de baño", grupo: "baño" },

  // Componentes de mando electrico
  { codigo: "TRB-277", nombreTrabajo: "Cambiar Sensor de nivel de bolsa de aire", grupo: "componentes de mando electrico" },

  // Estructuras
  { codigo: "TRB-278", nombreTrabajo: "Remachar Viseles de carroceria Izquierda", grupo: "estructuras" },

  // Puertas
  { codigo: "TRB-279", nombreTrabajo: "Reparar Puerta Derecha", grupo: "puertas" },

  // Compresor de aire acondicionado
  { codigo: "TRB-280", nombreTrabajo: "Cambiar Valvula de Alta de Compresor de Aire Acondicionado", grupo: "compresor de aire acondicionado" },

  // Valvulas
  { codigo: "TRB-281", nombreTrabajo: "Cambiar Valvula de 5 vias", grupo: "valvulas" },

  // Puertas
  { codigo: "TRB-282", nombreTrabajo: "Reparar Puerta de bateria", grupo: "puertas" },

  // Suspension
  { codigo: "TRB-283", nombreTrabajo: "Reparar Sistema de Suspension", grupo: "suspension" },

  // Caja de cambios
  { codigo: "TRB-284", nombreTrabajo: "Cambiar Abrazadera de cable de palanca de cambio", grupo: "caja de cambios" },
  { codigo: "TRB-285", nombreTrabajo: "Revisar Palanca de Caja de Cambios", grupo: "caja de cambios" },

  // Cubiertas
  { codigo: "TRB-286", nombreTrabajo: "Reparar Espejo retrovisor Izquierdo", grupo: "cubiertas" },

  // Freno de servicio
  { codigo: "TRB-287", nombreTrabajo: "Cambiar Liquido de frenos", grupo: "freno de servicio" },
  { codigo: "TRB-288", nombreTrabajo: "Revisar Nivel de liquido de frenos", grupo: "freno de servicio" },

  // Ruedas
  { codigo: "TRB-289", nombreTrabajo: "Revisar Rueda Posterior izquierda", grupo: "ruedas" },

  // Amortiguadores
  { codigo: "TRB-290", nombreTrabajo: "Ajustar Amortiguador Delantero derecho", grupo: "amortiguadores" },

  // Motor
  { codigo: "TRB-291", nombreTrabajo: "Cambiar Soporte de motor Delantero", grupo: "motor" },
  { codigo: "TRB-292", nombreTrabajo: "Cambiar Soporte de motor Posterior", grupo: "motor" },

  // Freno hidraulico
  { codigo: "TRB-293", nombreTrabajo: "Revisar Sistema electrico de ralentizador", grupo: "freno hidraulico" },

  // Techo
  { codigo: "TRB-294", nombreTrabajo: "Reparar Tapasol", grupo: "techo" },

  // Baño
  { codigo: "TRB-295", nombreTrabajo: "Reparar Extractor de Aire de Baño", grupo: "baño" },

  // Alumbrado
  { codigo: "TRB-296", nombreTrabajo: "Cambiar Faros laterales", grupo: "alumbrado" },

  // Admision y escape
  { codigo: "TRB-297", nombreTrabajo: "Limpiar Intercooler", grupo: "admision y escape" },

  // Sistema de refrigeracion
  { codigo: "TRB-298", nombreTrabajo: "Limpiar Radiador", grupo: "sistema de refrigeracion" },

  // Puertas
  { codigo: "TRB-299", nombreTrabajo: "Cambiar Tope de puerta principal", grupo: "puertas" },

  // Componentes de mando electrico
  { codigo: "TRB-300", nombreTrabajo: "Limpiar Sensor de nivel de bolsa de aire", grupo: "componentes de mando electrico" },

  // Bodegas
  { codigo: "TRB-301", nombreTrabajo: "Cambiar Chapa de bodega", grupo: "bodegas" },

  // Asientos
  { codigo: "TRB-302", nombreTrabajo: "Cambiar Cinturon de asiento piloto", grupo: "asientos" },

  // Radiotransmisor
  { codigo: "TRB-303", nombreTrabajo: "Reparar Radio transmisor", grupo: "radiotransmisor" },

  // Servicios de mantenimiento
  { codigo: "TRB-304", nombreTrabajo: "Realizar Auxilio mecanico", grupo: "servicios de mantenimiento" },

  // Cilindros
  { codigo: "TRB-305", nombreTrabajo: "Cambiar Pulmon de freno Posterior izquierdo", grupo: "cilindros" },

  // Manguetas
  { codigo: "TRB-306", nombreTrabajo: "Regular Pines de muñon de direccion", grupo: "manguetas" },

  // Componentes electricos y electronicos
  { codigo: "TRB-307", nombreTrabajo: "Revisar Sistema Electrico AA", grupo: "componentes electricos y electronicos" },

  // Sistema de refrigeracion
  { codigo: "TRB-308", nombreTrabajo: "Cambiar Bomba de agua", grupo: "sistema de refrigeracion" },

  // Mecanismos limpia y lava parabrisas
  { codigo: "TRB-309", nombreTrabajo: "Revisar plumillas  de Limpiaparabrisas", grupo: "mecanismos limpia y lava parabrisas" },

  // Compresor
  { codigo: "TRB-310", nombreTrabajo: "Cambiar Rodaje de Compresor", grupo: "compresor" },

  // Sistema de alimentacion
  { codigo: "TRB-311", nombreTrabajo: "Cambiar Sensor de gases", grupo: "sistema de alimentacion" },

  // Compresor
  { codigo: "TRB-312", nombreTrabajo: "Revisar Compresor", grupo: "compresor" },

  // Bodegas
  { codigo: "TRB-313", nombreTrabajo: "Reparar Chapa de bodega", grupo: "bodegas" },

  // Puertas
  { codigo: "TRB-314", nombreTrabajo: "Revisar puertas en General", grupo: "puertas" },

  // Sistema de lubricacion
  { codigo: "TRB-315", nombreTrabajo: "Revisar Enfriador de aceite", grupo: "sistema de lubricacion" },
  { codigo: "TRB-316", nombreTrabajo: "Reparar Fuga de aceite por enfriador de aceite", grupo: "sistema de lubricacion" },

  // Asientos
  { codigo: "TRB-317", nombreTrabajo: "Reparar Asiento de salon", grupo: "asientos" },
  { codigo: "TRB-318", nombreTrabajo: "Reparar Descansapies", grupo: "asientos" },

  // Sistema de refrigeracion
  { codigo: "TRB-319", nombreTrabajo: "Cambiar Faja de la bomba de agua", grupo: "sistema de refrigeracion" },

  // Alternador
  { codigo: "TRB-320", nombreTrabajo: "Cambiar Tensor Automático de Faja de Alternador", grupo: "alternador" },

  // Pms
  { codigo: "TRB-321", nombreTrabajo: "Realizar Plan de Mantenimiento 2", grupo: "pms" },

  // Freno de servicio
  { codigo: "TRB-322", nombreTrabajo: "Revisar Pastillas de freno delanteros", grupo: "freno de servicio" },

  // Forros y pastillas
  { codigo: "TRB-323", nombreTrabajo: "Revisar Pastillas de freno posteriores", grupo: "forros y pastillas" },

  // Componentes de mando electrico
  { codigo: "TRB-324", nombreTrabajo: "Cambiar Relay de Cambio de Luces", grupo: "componentes de mando electrico" },
  { codigo: "TRB-325", nombreTrabajo: "Cambiar Porta fusibles", grupo: "componentes de mando electrico" },

  // Calefaccion
  { codigo: "TRB-326", nombreTrabajo: "Instalar Sistema de Calefaccion", grupo: "calefaccion" },

  // Compresor de aire acondicionado
  { codigo: "TRB-327", nombreTrabajo: "Rectificar Polea de compresor de Aire acondicionado", grupo: "compresor de aire acondicionado" },

  // Sistema de alimentacion
  { codigo: "TRB-328", nombreTrabajo: "Cambiar Cebador de combustible", grupo: "sistema de alimentacion" },

  // Admision y escape
  { codigo: "TRB-329", nombreTrabajo: "Reparar catalizador de escape.", grupo: "admision y escape" },

  // Alternador
  { codigo: "TRB-330", nombreTrabajo: "Reparar Alternador P1", grupo: "alternador" },

  // Puertas
  { codigo: "TRB-331", nombreTrabajo: "Reparar Puerta de motor", grupo: "puertas" },

  // Claxon
  { codigo: "TRB-332", nombreTrabajo: "Cambiar Claxon de Aire", grupo: "claxon" },

  // Componentes electricos y electronicos
  { codigo: "TRB-333", nombreTrabajo: "Revisar Display  de A/A", grupo: "componentes electricos y electronicos" },

  // Servicios de mantenimiento
  { codigo: "TRB-334", nombreTrabajo: "Revisar Sistema de arranque", grupo: "servicios de mantenimiento" },

  // Sistema de refrigeracion
  { codigo: "TRB-335", nombreTrabajo: "Cambiar Bomba de ventilador hidraulico", grupo: "sistema de refrigeracion" },

  // Motor
  { codigo: "TRB-336", nombreTrabajo: "Cambiar Filtro de ventilador hidraulico", grupo: "motor" },

  // Componentes de mando electrico
  { codigo: "TRB-337", nombreTrabajo: "Cambiar Regulador de Voltaje de alternador P1", grupo: "componentes de mando electrico" },

  // Alternador
  { codigo: "TRB-338", nombreTrabajo: "Cambiar Rodaje de alternador P1", grupo: "alternador" },
  { codigo: "TRB-339", nombreTrabajo: "Cambiar Rodaje de alternador P2", grupo: "alternador" },

  // Video
  { codigo: "TRB-340", nombreTrabajo: "Fabricar  Soporte de monitor", grupo: "video" },

  // Compresor de aire acondicionado
  { codigo: "TRB-341", nombreTrabajo: "Cambiar Polea de compresor de Aire acondicionado", grupo: "compresor de aire acondicionado" },
  { codigo: "TRB-342", nombreTrabajo: "Cambiar Compresor de aire acondicionado", grupo: "compresor de aire acondicionado" },
  { codigo: "TRB-343", nombreTrabajo: "Revisar Rodaje de Compresor de AA", grupo: "compresor de aire acondicionado" },

  // Valvulas de aire comprimido
  { codigo: "TRB-344", nombreTrabajo: "Cambiar Valvula reguladora de aire", grupo: "valvulas de aire comprimido" },

  // Ruedas
  { codigo: "TRB-345", nombreTrabajo: "Reparar Neumatico 3", grupo: "ruedas" },

  // Bodegas
  { codigo: "TRB-346", nombreTrabajo: "Reparar Bodegas", grupo: "bodegas" },

  // Equipos interiores
  { codigo: "TRB-347", nombreTrabajo: "Revisar Interior de salon.", grupo: "equipos interiores" },

  // Componentes de mando electrico
  { codigo: "TRB-348", nombreTrabajo: "Revisar Sensor de rueda ABS", grupo: "componentes de mando electrico" },

  // Freno de motor
  { codigo: "TRB-349", nombreTrabajo: "Cambiar Valvula de freno motor", grupo: "freno de motor" },
  { codigo: "TRB-350", nombreTrabajo: "Revisar Freno de motor", grupo: "freno de motor" },

  // Ruedas
  { codigo: "TRB-351", nombreTrabajo: "Cambiar Tuercas de rueda Delantera derecha", grupo: "ruedas" },
  { codigo: "TRB-352", nombreTrabajo: "Cambiar Pernos de rueda Delantera izquierda", grupo: "ruedas" },

  // Sistema electrico
  { codigo: "TRB-353", nombreTrabajo: "Revisar Sistema Electrico del Tablero", grupo: "sistema electrico" },

  // Cubiertas
  { codigo: "TRB-354", nombreTrabajo: "Revisar Hermeticidad de carroceria en general", grupo: "cubiertas" },

  // Instrumentos
  { codigo: "TRB-355", nombreTrabajo: "Realizar mantenimiento de Multiplex", grupo: "instrumentos" },

  // Estructuras
  { codigo: "TRB-356", nombreTrabajo: "Cambiar Escarpin de guardabarro Izquierdo", grupo: "estructuras" },

  // Ruedas
  { codigo: "TRB-357", nombreTrabajo: "Cambiar Pernos de Bocamaza Delantera  Izquierda", grupo: "ruedas" },

  // Instrumentos
  { codigo: "TRB-358", nombreTrabajo: "Revisar Tacometro", grupo: "instrumentos" },

  // Sistema electrico
  { codigo: "TRB-359", nombreTrabajo: "Cambiar Panel de indicador de testigos", grupo: "sistema electrico" },

  // Admision y escape
  { codigo: "TRB-360", nombreTrabajo: "Cambiar sensor NOx.", grupo: "admision y escape" },

  // Servicios de mantenimiento
  { codigo: "TRB-361", nombreTrabajo: "Realizar Reprogramación de Unidad de Mando", grupo: "servicios de mantenimiento" },

  // Ruedas
  { codigo: "TRB-362", nombreTrabajo: "Engrasar Rodaje de rueda Delantera derecha", grupo: "ruedas" },
  { codigo: "TRB-363", nombreTrabajo: "Engrasar Rodaje de rueda Delantera izquierda", grupo: "ruedas" },
  { codigo: "TRB-364", nombreTrabajo: "Revisar Rodaje de rueda", grupo: "ruedas" },

  // Sistema electrico
  { codigo: "TRB-365", nombreTrabajo: "Instalar Inversor de voltaje", grupo: "sistema electrico" },

  // Admision y escape
  { codigo: "TRB-366", nombreTrabajo: "Limpiar Sensor de Admision de Aire", grupo: "admision y escape" },

  // Motor
  { codigo: "TRB-367", nombreTrabajo: "Reparar Motor", grupo: "motor" },

  // Sistema de lubricacion
  { codigo: "TRB-368", nombreTrabajo: "Cambiar Bomba de aceite de motor", grupo: "sistema de lubricacion" },

  // Cigüeñal
  { codigo: "TRB-369", nombreTrabajo: "Cambiar Metales de bielas", grupo: "cigüeñal" },
  { codigo: "TRB-370", nombreTrabajo: "Cambiar Metales de bancada", grupo: "cigüeñal" },

  // Sistema de lubricacion
  { codigo: "TRB-371", nombreTrabajo: "Cambiar Sensor de nivel de aceite", grupo: "sistema de lubricacion" },

  // Componentes de mando electrico
  { codigo: "TRB-372", nombreTrabajo: "Cambiar Sensor de Temperatura", grupo: "componentes de mando electrico" },

  // Sistema de lubricacion
  { codigo: "TRB-373", nombreTrabajo: "Cambiar Empaquetadura de carter", grupo: "sistema de lubricacion" },

  // Suspension de ballestas
  { codigo: "TRB-374", nombreTrabajo: "Colocar arandelas de presion", grupo: "suspension de ballestas" },

  // Baño
  { codigo: "TRB-375", nombreTrabajo: "Cambiar Valvula del sistema de baño", grupo: "baño" },

  // Bateria
  { codigo: "TRB-376", nombreTrabajo: "Revisar Baterias", grupo: "bateria" },

  // Admision y escape
  { codigo: "TRB-377", nombreTrabajo: "Limpiar filtro de adblue", grupo: "admision y escape" },
  { codigo: "TRB-378", nombreTrabajo: "Cambiar tapa de tanque de adblue", grupo: "admision y escape" },
  { codigo: "TRB-379", nombreTrabajo: "Revisar Intercooler", grupo: "admision y escape" },

  // Sistema de alimentacion
  { codigo: "TRB-380", nombreTrabajo: "Desmontar Intercooler.", grupo: "sistema de alimentacion" },

  // Alumbrado
  { codigo: "TRB-381", nombreTrabajo: "Cambiar Focos de luz de castillo", grupo: "alumbrado" },

  // Admision y escape
  { codigo: "TRB-382", nombreTrabajo: "Cambiar Serpentin de tubo de escape", grupo: "admision y escape" },

  // Salon
  { codigo: "TRB-383", nombreTrabajo: "Fijar Tapizones de Piso y Escaler Bus", grupo: "salon" },

  // Sistema de refrigeracion
  { codigo: "TRB-384", nombreTrabajo: "Revisar Ventilador", grupo: "sistema de refrigeracion" },
  { codigo: "TRB-385", nombreTrabajo: "Rellenar Aceite de ventilador hidraulico", grupo: "sistema de refrigeracion" },

  // Alternador
  { codigo: "TRB-386", nombreTrabajo: "Realizar Mantenimiento de alternador P1", grupo: "alternador" },
  { codigo: "TRB-387", nombreTrabajo: "Realizar Mantenimiento de alternador P2", grupo: "alternador" },

  // Sistema de refrigeracion
  { codigo: "TRB-388", nombreTrabajo: "Cambiar Aceite de ventilador hidraulico", grupo: "sistema de refrigeracion" },

  // Alumbrado
  { codigo: "TRB-389", nombreTrabajo: "Cambiar Mica Lateral", grupo: "alumbrado" },

  // Componentes electricos y electronicos
  { codigo: "TRB-390", nombreTrabajo: "Instalar Radiomusical", grupo: "componentes electricos y electronicos" },

  // Servicios de mantenimiento
  { codigo: "TRB-391", nombreTrabajo: "Realizar Monitoreo de ruido", grupo: "servicios de mantenimiento" },

  // Motor
  { codigo: "TRB-392", nombreTrabajo: "Desmontar Motor", grupo: "motor" },

  // Parachoques
  { codigo: "TRB-393", nombreTrabajo: "Reparar Parachoques Delantero", grupo: "parachoques" },

  // Admision y escape
  { codigo: "TRB-394", nombreTrabajo: "Cambiar Manguera de Intercooler", grupo: "admision y escape" },

  // Salon
  { codigo: "TRB-395", nombreTrabajo: "Colocar Pernos de Tapas de pasillo", grupo: "salon" },

  // Arbol de transmision
  { codigo: "TRB-396", nombreTrabajo: "Revisar Cardan de fuerza", grupo: "arbol de transmision" },
  { codigo: "TRB-397", nombreTrabajo: "Cambiar Crucetas de cardan de fuerza", grupo: "arbol de transmision" },

  // Lineas de aire comprimido
  { codigo: "TRB-398", nombreTrabajo: "Cambiar Manguera de Aire del Brake", grupo: "lineas de aire comprimido" },

  // Embrague
  { codigo: "TRB-399", nombreTrabajo: "Cambiar Bomba servo de embrague", grupo: "embrague" },
  { codigo: "TRB-400", nombreTrabajo: "Regular Embrague", grupo: "embrague" },

  // Sistema de alimentacion
  { codigo: "TRB-401", nombreTrabajo: "Revisar Fuga de combustible por cañeria", grupo: "sistema de alimentacion" },
  { codigo: "TRB-402", nombreTrabajo: "Ajustar Abrazaderas de Admision", grupo: "sistema de alimentacion" },

  // Embrague
  { codigo: "TRB-403", nombreTrabajo: "Cambiar Cilindro de embrague", grupo: "embrague" },

  // Estructuras
  { codigo: "TRB-404", nombreTrabajo: "Reparar Carroceria Posterior", grupo: "estructuras" },

  // Freno de servicio
  { codigo: "TRB-405", nombreTrabajo: "Limpiar Pastillas de freno delanteros", grupo: "freno de servicio" },

  // Admision y escape
  { codigo: "TRB-406", nombreTrabajo: "Cambiar Empaquetaduras de multiple de escape", grupo: "admision y escape" },

  // Componentes de mando electrico
  { codigo: "TRB-407", nombreTrabajo: "Cambiar Equipo GPS", grupo: "componentes de mando electrico" },

  // Claxon
  { codigo: "TRB-408", nombreTrabajo: "Cambiar Claxon electrico", grupo: "claxon" },

  // Amortiguadores
  { codigo: "TRB-409", nombreTrabajo: "Cambiar Amortiguador Posterior derecho", grupo: "amortiguadores" }
])
    .returning();

  console.log("✅ Tasks inserted:", tareasData.length);
  return tareasData;
}