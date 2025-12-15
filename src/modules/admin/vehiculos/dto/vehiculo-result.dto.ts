import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { vehiculosEstado } from "@model/tables/vehiculo.model";
import { VehiculoDocumentoResultDto } from "./vehiculo-documento-result.dto";
import type { VehiculoEstado } from "@model/tables/vehiculo.model";
import type { VehiculoDocumentoTipo } from "@model/tables/vehiculo-documento.model";

export class DocumentosAgrupadosVehiculoDto
  implements Record<VehiculoDocumentoTipo, VehiculoDocumentoResultDto[]>
{
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

export class VehiculoResultDto {
  @ApiProperty({ example: 1, description: "Vehicle ID" })
  id: number;

  @ApiProperty({ example: "ABC-123", description: "Vehicle license plate" })
  placa: string;

  @ApiPropertyOptional({
    example: "0582",
    description: "Internal vehicle code",
  })
  codigoInterno: string | null;

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
    enum: vehiculosEstado.enumValues,
    example: vehiculosEstado.enumValues[0],
    description: "Vehicle status",
  })
  estado: VehiculoEstado;

  @ApiPropertyOptional({
    example: ["https://res.cloudinary.com/xxx/image.jpg"],
    description: "Lista de URLs de imágenes del vehículo",
    type: [String],
  })
  imagenes: string[];

  @ApiPropertyOptional({
    example: ["https://res.cloudinary.com/xxx/document.pdf"],
    description: "Lista de URLs de documentos del vehículo (campo legacy)",
    type: [String],
  })
  documentosLegacy: string[];

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

  @ApiProperty({ description: "Vehicle documents grouped by type" })
  documentos: DocumentosAgrupadosVehiculoDto;
}
