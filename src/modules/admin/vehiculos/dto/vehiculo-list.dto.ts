import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { vehiculosEstado, combustibleEnum } from '@model/tables/vehiculo.model';
import type { VehiculoEstado, CombustibleTipo } from '@model/tables/vehiculo.model';
import { IsOptional } from 'class-validator';

export class VehiculoListDto {
  @ApiProperty({ example: 1, description: 'Vehicle ID' })
  id: number;

  @ApiProperty({ example: 'ABC-123', description: 'Vehicle license plate' })
  placa: string;

  @ApiPropertyOptional({ example: 'XYZ-789', description: 'Previous license plate' })
  placaAnterior: string | null;

  @ApiPropertyOptional({ example: '00012', description: 'Internal vehicle code' })
  codigoInterno: string | null;

  @ApiProperty({ example: 'Toyota', description: 'Vehicle brand' })
  marca: string;

  @ApiProperty({ example: 'Corolla', description: 'Vehicle model' })
  modelo: string;

  @ApiProperty({ example: 1, description: 'Vehicle model ID' })
  modeloId: number;

  @ApiProperty({ example: 2020, description: 'Manufacturing year' })
  anio: number;

  @ApiPropertyOptional({ example: 'VIN1234567890ABCD', description: 'VIN' })
  vin: string | null;

  @ApiPropertyOptional({ example: 'Blanco', description: 'Color' })
  color: string | null;

  @ApiPropertyOptional({
    enum: combustibleEnum.enumValues,
    description: 'Fuel type',
  })
  combustible: CombustibleTipo | null;

  @ApiProperty({ example: 50000, description: 'Current mileage' })
  kilometraje: number;

  @ApiProperty({
    enum: vehiculosEstado.enumValues,
    example: vehiculosEstado.enumValues[0],
    description: 'Vehicle status',
  })
  estado: VehiculoEstado;

  @ApiPropertyOptional({ type: [String], description: 'List of owners names', default: [] })
  propietarios_nombres?: string[];

  @ApiPropertyOptional({ type: [String], description: 'List of suppliers names', default: [] })
  proveedores_nombres?: string[];

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

  @ApiPropertyOptional({
    example: null,
    description: 'Deletion date',
    nullable: true,
  })
  eliminadoEn: Date | null;

  @ApiPropertyOptional({
    example: ['https://res.cloudinary.com/xxx/image.jpg'],
    description: 'Lista de URLs de imágenes del vehículo',
    type: [String],
  })
  imagenes: string[];
}
