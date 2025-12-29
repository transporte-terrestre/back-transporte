import { IsString, IsNotEmpty, IsInt, Min, IsOptional, IsIn, IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehiculoDTO, vehiculosEstado, combustibleEnum } from '@model/tables/vehiculo.model';
import type { VehiculoEstado, CombustibleTipo } from '@model/tables/vehiculo.model';

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

  @ApiPropertyOptional({ example: 1500.5, description: 'Payload capacity in Kg' })
  @IsNumber()
  @IsOptional()
  cargaUtil: string | null;

  @ApiPropertyOptional({ example: 2500.0, description: 'Gross weight in Kg' })
  @IsNumber()
  @IsOptional()
  pesoBruto: string | null;

  @ApiPropertyOptional({ example: 1000.0, description: 'Net weight in Kg' })
  @IsNumber()
  @IsOptional()
  pesoNeto: string | null;

  @ApiPropertyOptional({ example: 2, description: 'Number of seats' })
  @IsInt()
  @Min(0)
  @IsOptional()
  asientos: number | null;

  @ApiPropertyOptional({ example: 2, description: 'Number of axles' })
  @IsInt()
  @Min(1)
  @IsOptional()
  ejes: number | null;

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

  @ApiPropertyOptional({ example: 1, description: 'Vehicle owner ID' })
  @IsInt()
  @Min(1)
  @IsOptional()
  propietarioId: number | null;

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
