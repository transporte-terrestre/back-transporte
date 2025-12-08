import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { estadoVehiculo } from "@model/tables/vehiculo.model";

export class VehiculoResultDto {
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

  @ApiProperty({ example: "2025-12-31", description: "SOAT expiration date" })
  fechaVencimientoSoat: string;

  @ApiProperty({
    enum: estadoVehiculo.enumValues,
    example: estadoVehiculo.enumValues[0],
    description: "Vehicle status",
  })
  estado: (typeof estadoVehiculo.enumValues)[number];

  @ApiPropertyOptional({ 
    example: ["https://res.cloudinary.com/xxx/image.jpg"], 
    description: "Lista de URLs de imágenes del vehículo",
    type: [String]
  })
  imagenes: string[];

  @ApiPropertyOptional({ 
    example: ["https://res.cloudinary.com/xxx/document.pdf"], 
    description: "Lista de URLs de documentos del vehículo",
    type: [String]
  })
  documentos: string[];

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
}
