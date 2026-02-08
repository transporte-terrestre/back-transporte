import { ApiProperty } from '@nestjs/swagger';
import { vehiculoChecklistDocumentViajeTipoEnum } from '@db/tables/vehiculo-checklist-document.table';
import type { VehiculoChecklistDocumentViajeTipo } from '@db/tables/vehiculo-checklist-document.table';

export class ResultHojaItemDto {
  @ApiProperty({ description: 'Etiqueta del item' })
  label: string;

  @ApiProperty({ description: 'Nivel Criticidad: rojo, amarillo, verde', required: false, example: 'rojo' })
  color?: string;

  @ApiProperty({ description: 'Valor del check (SI/NO)', example: true })
  value: boolean;
}

// 1. Declaración Jurada
export class DeclaracionJuradaItemsDto {
  @ApiProperty({ type: ResultHojaItemDto }) descansoSuficiente: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) condicionesFisicas: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) medicamentos: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) condicionesEmocionales: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) conscienteResponsabilidad: ResultHojaItemDto;
}
export class DeclaracionJuradaSectionDto {
  @ApiProperty({ description: 'Título de la sección' }) label: string;
  @ApiProperty({ type: DeclaracionJuradaItemsDto }) items: DeclaracionJuradaItemsDto;
}

// 2. Estado General
export class EstadoGeneralItemsDto {
  @ApiProperty({ type: ResultHojaItemDto }) farosPrincipales: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) lucesDireccionales: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) lucesFreno: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) luzEstroboscopica: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) espejos: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) parabrisasVentanas: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) plumillas: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) neumaticos: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) esparragosTuercas: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) cartolas: ResultHojaItemDto;
}
export class EstadoGeneralSectionDto {
  @ApiProperty({ description: 'Título de la sección' }) label: string;
  @ApiProperty({ type: EstadoGeneralItemsDto }) items: EstadoGeneralItemsDto;
}

// 3. Estado Interno
export class EstadoInternoItemsDto {
  @ApiProperty({ type: ResultHojaItemDto }) cinturonesEstado: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) alarmaRetroceso: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) segurosPuertas: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) claxon: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) documentosVigentes: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) kitHerramientas: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) gata: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) ordenLimpieza: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) jaulaAntivuelco: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) aireAcondicionado: ResultHojaItemDto;
}
export class EstadoInternoSectionDto {
  @ApiProperty({ description: 'Título de la sección' }) label: string;
  @ApiProperty({ type: EstadoInternoItemsDto }) items: EstadoInternoItemsDto;
}

// 4. Elementos de Seguridad
export class ElementosSeguridadItemsDto {
  @ApiProperty({ type: ResultHojaItemDto }) tacosCunas: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) conosSeguridad: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) eslingaGrilletes: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) picoPala: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) cableCorriente: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) extintor: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) botiquinLinterna: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) kitAntiderrame: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) sistemaComunicacion: ResultHojaItemDto;
}
export class ElementosSeguridadSectionDto {
  @ApiProperty({ description: 'Título de la sección' }) label: string;
  @ApiProperty({ type: ElementosSeguridadItemsDto }) items: ElementosSeguridadItemsDto;
}

// 5. Estado Mecanico
export class EstadoMecanicoItemsDto {
  @ApiProperty({ type: ResultHojaItemDto }) pruebaFrenoServicio: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) frenoEstacionamiento: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) direccion: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) nivelAceiteMotor: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) nivelLiquidoFrenos: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) nivelRefrigerante: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) nivelAceiteHidraulico: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) nivelAguaLimpiaparabrisas: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) otrosMecanico: ResultHojaItemDto;
}
export class EstadoMecanicoSectionDto {
  @ApiProperty({ description: 'Título de la sección' }) label: string;
  @ApiProperty({ type: EstadoMecanicoItemsDto }) items: EstadoMecanicoItemsDto;
}

// 6. Sistemas Criticos
export class SistemasCriticosItemsDto {
  @ApiProperty({ type: ResultHojaItemDto }) mobiliEye: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) sensorFatiga: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) frenosABS: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) espEsc: ResultHojaItemDto;
}
export class SistemasCriticosSectionDto {
  @ApiProperty({ description: 'Título de la sección' }) label: string;
  @ApiProperty({ type: SistemasCriticosItemsDto }) items: SistemasCriticosItemsDto;
}

// 7. Cinturones Seguridad
export class CinturonesSeguridadItemsDto {
  @ApiProperty({ type: ResultHojaItemDto }) cinturonesPilotos: ResultHojaItemDto;
  @ApiProperty({ type: ResultHojaItemDto }) cinturonesPasajes: ResultHojaItemDto;
}
export class CinturonesSeguridadSectionDto {
  @ApiProperty({ description: 'Título de la sección' }) label: string;
  @ApiProperty({ type: CinturonesSeguridadItemsDto }) items: CinturonesSeguridadItemsDto;
}

// Document
export class ResultHojaDocumentDto {
  @ApiProperty({ type: DeclaracionJuradaSectionDto }) declaracionJurada: DeclaracionJuradaSectionDto;
  @ApiProperty({ type: EstadoGeneralSectionDto }) estadoGeneral: EstadoGeneralSectionDto;
  @ApiProperty({ type: EstadoInternoSectionDto }) estadoInterno: EstadoInternoSectionDto;
  @ApiProperty({ type: ElementosSeguridadSectionDto }) elementosSeguridad: ElementosSeguridadSectionDto;
  @ApiProperty({ type: EstadoMecanicoSectionDto }) estadoMecanico: EstadoMecanicoSectionDto;
  @ApiProperty({ type: SistemasCriticosSectionDto }) sistemasCriticos: SistemasCriticosSectionDto;
  @ApiProperty({ type: CinturonesSeguridadSectionDto }) cinturonesSeguridad: CinturonesSeguridadSectionDto;
}

export class ResultHojaInspeccionDto {
  @ApiProperty({ description: 'ID del Viaje (si aplica)', nullable: true, example: 1 })
  viajeId: number | null;

  @ApiProperty({ description: 'ID del Vehículo', example: 10 })
  vehiculoId: number;

  @ApiProperty({ description: 'Código de versión del checklist', example: 'v00001_002_0000000001_salida' })
  version: string;

  @ApiProperty({
    description: 'Tipo de viaje',
    enum: vehiculoChecklistDocumentViajeTipoEnum.enumValues,
    example: vehiculoChecklistDocumentViajeTipoEnum.enumValues[0],
    nullable: true,
  })
  viajeTipo: VehiculoChecklistDocumentViajeTipo | null;

  @ApiProperty({ type: ResultHojaDocumentDto })
  document: ResultHojaDocumentDto;
}
