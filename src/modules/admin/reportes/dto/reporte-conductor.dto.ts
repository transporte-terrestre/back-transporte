import { ApiProperty } from '@nestjs/swagger';

export class ReporteConductorDto {
  @ApiProperty({ example: 1, description: 'ID del conductor' })
  id: number;

  @ApiProperty({ example: '2043893327', description: 'RUC de la empresa (Hardcoded)' })
  rucEmpresa: string;

  @ApiProperty({ example: '2.MAY.3298', description: 'OST (Hardcoded)' })
  ost: string;

  @ApiProperty({ example: '12345678', description: 'DNI del conductor' })
  dni: string; // rut

  @ApiProperty({ example: 'JUAN', description: 'Nombres del conductor' })
  nombres: string;

  @ApiProperty({ example: 'PEREZ', description: 'Apellidos del conductor' })
  apellidos: string;

  @ApiProperty({ example: 'SI', description: 'Induccion - Anexo 4' })
  induccionAnexo4: string;

  @ApiProperty({ example: 'NA', description: 'Fec.Emision Induccion' })
  fecEmisionInduccion: string;

  @ApiProperty({ example: 'SI', description: 'Manejo defensivo AAQ' })
  manejoDefensivoAaq: string;

  @ApiProperty({ example: '29-01-2026', description: 'Fec.Vence Manejo Def' })
  fecVenceManejoDef: string;

  @ApiProperty({ example: 'SI', description: 'SCTR' })
  sctr: string;

  @ApiProperty({ example: '31-12-2025', description: 'Vencimiento SCTR' })
  vencimientoSctr: string;

  @ApiProperty({ example: 'SI', description: 'Seguro vida Ley' })
  seguroVidaLey: string;

  @ApiProperty({ example: '01-01-2026', description: 'Fec. Vence Seg Vida Ley' })
  fecVenceSegVidaLey: string;

  @ApiProperty({ example: 'SI', description: 'Documento de Identidad' })
  documentoIdentidad: string;

  @ApiProperty({ example: 'NO', description: 'AUTORIZA_SSGG' })
  autorizaSsgg: string;

  @ApiProperty({ example: 'NO', description: 'Curso Seguridad Portuaria' })
  cursoSeguridadPortuaria: string;

  @ApiProperty({ example: 'SI', description: 'Foto Funcionario' })
  fotoFuncionario: string;

  @ApiProperty({ example: 'NO', description: 'Curso Mercancias Peligrosas' })
  cursoMercanciasPeligrosas: string;

  @ApiProperty({ example: 'NO', description: 'Curso Basico PBIP' })
  cursoBasicoPbip: string;

  @ApiProperty({ example: 'NA', description: 'F. Venc. Examen Medico Temporal' })
  fVencExamenMedicoTemporal: string;

  @ApiProperty({ example: '29-05-2026', description: 'F. Vence examen medico' })
  fVenceExamenMedico: string;

  @ApiProperty({ example: '29-05-2026', description: 'Vence Examen Psicosensometrico' })
  venceExamenPsicosensometrico: string;

  @ApiProperty({ example: 'NA', description: 'Fecha induccion temporal' })
  fechaInduccionTemporal: string;

  @ApiProperty({ example: 'NA', description: 'Vence Induccion Visita' })
  venceInduccionVisita: string;

  @ApiProperty({ example: 'NA', description: 'Vence EM Visita' })
  venceEmVisita: string;

  @ApiProperty({ example: '06-01-2027', description: 'Fecha Vencimiento Licencia' })
  fechaVencimientoLicencia: string;

  @ApiProperty({ example: 'NO', description: 'PASECONDUC' })
  paseconduc: string;
}
