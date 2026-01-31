import { IsString, IsNotEmpty, IsInt, Min, IsOptional, IsIn, IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehiculoDTO, vehiculosEstado, combustibleEnum } from '@db/tables/vehiculo.table';
import type { VehiculoEstado, CombustibleTipo } from '@db/tables/vehiculo.table';

export class VehiculoCreateDto implements Omit<VehiculoDTO, 'id' | 'creadoEn' | 'actualizadoEn' | 'codigoInterno'> {
  @ApiProperty({ example: 'ABC-123', description: 'Vehicle license plate' })
  @IsString()
  @IsNotEmpty()
  placa: string;

  @ApiPropertyOptional({ example: 'XYZ-789', description: 'Previous license plate' })
  @IsString()
  @IsOptional()
  placaAnterior: string | null;

  @ApiProperty({ example: 1, description: 'Vehicle model ID' })
  @IsInt()
  @Min(1)
  modeloId: number;

  @ApiProperty({ example: 2020, description: 'Manufacturing year' })
  @IsInt()
  @Min(1900)
  anio: number;

  @ApiPropertyOptional({ example: 'VIN1234567890ABCD', description: 'Vehicle Identification Number' })
  @IsString()
  @IsOptional()
  vin: string | null;

  @ApiPropertyOptional({ example: 'MOTOR123', description: 'Engine number' })
  @IsString()
  @IsOptional()
  numeroMotor: string | null;

  @ApiPropertyOptional({ example: 'SERIE123', description: 'Series number' })
  @IsString()
  @IsOptional()
  numeroSerie: string | null;

  @ApiPropertyOptional({ example: 'Blanco', description: 'Vehicle color' })
  @IsString()
  @IsOptional()
  color: string | null;

  @ApiPropertyOptional({
    enum: combustibleEnum.enumValues,
    description: 'Fuel type',
  })
  @IsOptional()
  @IsIn(combustibleEnum.enumValues)
  combustible: CombustibleTipo | null;

  @ApiPropertyOptional({ example: 'PICK UP', description: 'Bodywork type' })
  @IsString()
  @IsOptional()
  carroceria: string | null;

  @ApiPropertyOptional({ example: 'N1', description: 'Vehicle category' })
  @IsString()
  @IsOptional()
  categoria: string | null;

  @ApiPropertyOptional({ example: '1500.5', description: 'Payload capacity in Kg' })
  @IsString()
  @IsOptional()
  cargaUtil: string | null;

  @ApiPropertyOptional({ example: '2500.0', description: 'Gross weight in Kg' })
  @IsString()
  @IsOptional()
  pesoBruto: string | null;

  @ApiPropertyOptional({ example: '1000.0', description: 'Net weight in Kg' })
  @IsString()
  @IsOptional()
  pesoNeto: string | null;

  @ApiPropertyOptional({ example: 2, description: 'Number of seats' })
  @IsInt()
  @Min(0)
  @IsOptional()
  asientos: number | null;

  @ApiPropertyOptional({ example: 4, description: 'Number of passengers' })
  @IsInt()
  @Min(0)
  @IsOptional()
  pasajeros: number | null;

  @ApiPropertyOptional({ example: 2, description: 'Number of axles' })
  @IsInt()
  @Min(1)
  @IsOptional()
  ejes: number | null;

  @ApiPropertyOptional({ example: 4, description: 'Number of wheels' })
  @IsInt()
  @Min(1)
  @IsOptional()
  ruedas: number | null;

  @ApiProperty({ example: 50000, description: 'Current mileage' })
  @IsInt()
  @Min(0)
  kilometraje: number;

  @ApiPropertyOptional({
    enum: vehiculosEstado.enumValues,
    description: 'Vehicle status',
    default: vehiculosEstado.enumValues[0],
  })
  @IsOptional()
  @IsIn(vehiculosEstado.enumValues)
  estado: VehiculoEstado;

  // New fields
  @ApiPropertyOptional({ example: 'Some notes', description: 'Annotations' })
  @IsString()
  @IsOptional()
  anotaciones: string | null;

  @ApiPropertyOptional({ example: 'Lima', description: 'Headquarters' })
  @IsString()
  @IsOptional()
  sede: string | null;

  @ApiPropertyOptional({ example: '110@3400', description: 'Power' })
  @IsString()
  @IsOptional()
  potencia: string | null;

  @ApiPropertyOptional({ example: '4x4', description: 'Rolling formula' })
  @IsString()
  @IsOptional()
  formulaRodante: string | null;

  @ApiPropertyOptional({ example: 'DX', description: 'Version' })
  @IsString()
  @IsOptional()
  version: string | null;

  @ApiPropertyOptional({ example: 4, description: 'Cylinders' })
  @IsInt()
  @IsOptional()
  cilindros: number | null;

  @ApiPropertyOptional({ example: '2.776', description: 'Displacement' })
  @IsString()
  @IsOptional()
  cilindrada: string | null;

  @ApiPropertyOptional({ example: '5.365', description: 'Length' })
  @IsString()
  @IsOptional()
  longitud: string | null;

  @ApiPropertyOptional({ example: '1.809', description: 'Height' })
  @IsString()
  @IsOptional()
  altura: string | null;

  @ApiPropertyOptional({ example: '1.9', description: 'Width' })
  @IsString()
  @IsOptional()
  ancho: string | null;

  @ApiPropertyOptional({ example: [1, 2], description: 'List of owner IDs', type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  propietarios?: number[];

  @ApiPropertyOptional({ example: [1, 2], description: 'List of supplier IDs', type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  proveedores?: number[];

  @ApiPropertyOptional({
    example: ['https://res.cloudinary.com/xxx/image.jpg'],
    description: 'Lista de URLs de imágenes del vehículo',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagenes?: string[];

  @ApiPropertyOptional({
    example: ['https://res.cloudinary.com/xxx/document.pdf'],
    description: 'Lista de URLs de documentos del vehículo',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documentos?: string[];
}
