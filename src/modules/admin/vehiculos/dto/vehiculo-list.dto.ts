import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { vehiculosEstado } from "@model/tables/vehiculo.model";
import type { VehiculoEstado } from "@model/tables/vehiculo.model";

export class VehiculoListDto {
  @ApiProperty({ example: 1, description: "Vehicle ID" })
  id: number;

  @ApiProperty({ example: "ABC-123", description: "Vehicle license plate" })
  placa: string;

  @ApiProperty({ example: "Toyota", description: "Vehicle brand" })
  marca: string;

  @ApiProperty({ example: "Corolla", description: "Vehicle model" })
  modelo: string;

  @ApiProperty({ example: 2020, description: "Manufacturing year" })
  anio: number;

  @ApiProperty({ example: 50000, description: "Current mileage" })
  kilometraje: number;

  @ApiProperty({
    enum: vehiculosEstado.enumValues,
    example: vehiculosEstado.enumValues[0],
    description: "Vehicle status",
  })
  estado: VehiculoEstado;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Creation date",
  })
  creadoEn: Date;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Update date",
  })
  actualizadoEn: Date;

  @ApiPropertyOptional({
    example: ["https://res.cloudinary.com/xxx/image.jpg"],
    description: "Lista de URLs de imágenes del vehículo",
    type: [String],
  })
  imagenes: string[];
}
