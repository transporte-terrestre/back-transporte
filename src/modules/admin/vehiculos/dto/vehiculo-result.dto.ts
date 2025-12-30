import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { vehiculosEstado, combustibleEnum } from '@model/tables/vehiculo.model';
import { VehiculoDocumentoResultDto } from './vehiculo-documento-result.dto';
import type { VehiculoEstado, CombustibleTipo } from '@model/tables/vehiculo.model';
import type { VehiculoDocumentoTipo } from '@model/tables/vehiculo-documento.model';

export class DocumentosAgrupadosVehiculoDto implements Record<VehiculoDocumentoTipo, VehiculoDocumentoResultDto[]> {
  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  tarjeta_propiedad: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  tarjeta_unica_circulacion: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  citv: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  soat: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  poliza: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  certificado_operatividad_factura: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  plan_mantenimiento_historico: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  certificado_instalacion_gps: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  certificado_valor_anadido: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  constancia_gps: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  certificado_tacos: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  certificado_extintores_hidrostatica: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  certificado_norma_r66: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  certificado_laminados_lunas: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  certificado_carroceria: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  certificado_caracteristicas_tecnicas: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  certificado_adas: VehiculoDocumentoResultDto[];

  @ApiProperty({ type: [VehiculoDocumentoResultDto] })
  otros: VehiculoDocumentoResultDto[];
}

export class PropietarioVehiculoDto {
  @ApiProperty({ example: 1, description: 'Owner ID' })
  id: number;

  @ApiProperty({ example: 'Juan Perez', description: 'Owner Name' })
  nombre: string;
}

export class VehiculoResultDto {
  @ApiProperty({ example: 1, description: 'Vehicle ID' })
  id: number;

  @ApiProperty({ example: 'ABC-123', description: 'Vehicle license plate' })
  placa: string;

  @ApiPropertyOptional({ example: 'XYZ-789', description: 'Previous license plate' })
  placaAnterior: string | null;

  @ApiPropertyOptional({
    example: '0582',
    description: 'Internal vehicle code',
  })
  codigoInterno: string | null;

  @ApiProperty({ example: 1, description: 'Vehicle model ID' })
  modeloId: number;

  @ApiProperty({ example: 'Toyota', description: 'Vehicle brand' })
  marca: string;

  @ApiProperty({ example: 'Corolla', description: 'Vehicle model' })
  modelo: string;

  @ApiProperty({ example: 2020, description: 'Manufacturing year' })
  anio: number;

  @ApiPropertyOptional({ example: 2021, description: 'Model year' })
  anioModelo: number | null;

  @ApiPropertyOptional({ example: 'VIN1234567890ABCD', description: 'VIN' })
  vin: string | null;

  @ApiPropertyOptional({ example: 'MOTOR123', description: 'Engine number' })
  numeroMotor: string | null;

  @ApiPropertyOptional({ example: 'SERIE123', description: 'Series number' })
  numeroSerie: string | null;

  @ApiPropertyOptional({ example: 'Blanco', description: 'Color' })
  color: string | null;

  @ApiPropertyOptional({
    enum: combustibleEnum.enumValues,
    description: 'Fuel type',
  })
  combustible: CombustibleTipo | null;

  @ApiPropertyOptional({ example: 'PICK UP', description: 'Bodywork type' })
  carroceria: string | null;

  @ApiPropertyOptional({ example: 'N1', description: 'Vehicle category' })
  categoria: string | null;

  @ApiPropertyOptional({ example: '1500.50', description: 'Payload Kg' })
  cargaUtil: string | null;

  @ApiPropertyOptional({ example: '2500.00', description: 'Gross weight Kg' })
  pesoBruto: string | null;

  @ApiPropertyOptional({ example: '1000.00', description: 'Net weight Kg' })
  pesoNeto: string | null;

  @ApiPropertyOptional({ example: 2, description: 'Seats' })
  asientos: number | null;

  @ApiPropertyOptional({ example: 4, description: 'Passengers' })
  pasajeros: number | null;

  @ApiPropertyOptional({ example: 2, description: 'Axles' })
  ejes: number | null;

  @ApiPropertyOptional({ example: 4, description: 'Wheels' })
  ruedas: number | null;

  @ApiProperty({ example: 50000, description: 'Current mileage' })
  kilometraje: number;

  @ApiProperty({
    enum: vehiculosEstado.enumValues,
    example: vehiculosEstado.enumValues[0],
    description: 'Vehicle status',
  })
  estado: VehiculoEstado;

  // New fields
  @ApiPropertyOptional({ example: 'Some notes', description: 'Annotations' })
  anotaciones: string | null;

  @ApiPropertyOptional({ example: 'Lima', description: 'Headquarters' })
  sede: string | null;

  @ApiPropertyOptional({ example: '110@3400', description: 'Power' })
  potencia: string | null;

  @ApiPropertyOptional({ example: '4x4', description: 'Rolling formula' })
  formulaRodante: string | null;

  @ApiPropertyOptional({ example: 'DX', description: 'Version' })
  version: string | null;

  @ApiPropertyOptional({ example: 4, description: 'Cylinders' })
  cilindros: number | null;

  @ApiPropertyOptional({ example: '2.776', description: 'Displacement' })
  cilindrada: string | null;

  @ApiPropertyOptional({ example: '5.365', description: 'Length' })
  longitud: string | null;

  @ApiPropertyOptional({ example: '1.809', description: 'Height' })
  altura: string | null;

  @ApiPropertyOptional({ example: '1.90', description: 'Width' })
  ancho: string | null;

  @ApiProperty({ type: [PropietarioVehiculoDto], description: 'List of owners'})
  propietarios: PropietarioVehiculoDto[];

  @ApiPropertyOptional({
    example: ['https://res.cloudinary.com/xxx/image.jpg'],
    description: 'Lista de URLs de imágenes del vehículo',
    type: [String],
  })
  imagenes: string[];

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  creadoEn: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Update date',
  })
  actualizadoEn: Date;

  @ApiProperty({ description: 'Vehicle documents grouped by type' })
  documentos: DocumentosAgrupadosVehiculoDto;
}
