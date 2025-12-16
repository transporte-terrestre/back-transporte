import { ApiProperty } from "@nestjs/swagger";
import { conductorDocumentosTipo } from "@model/tables/conductor-documento.model";
import type { ConductorDocumentoTipo } from "@model/tables/conductor-documento.model";

export class ConductorDocumentoResultDto {
  @ApiProperty({ example: 1, description: "ID del documento" })
  id: number;

  @ApiProperty({ example: 1, description: "ID del conductor" })
  conductorId: number;

  @ApiProperty({
    enum: conductorDocumentosTipo.enumValues,
    description: "Tipo de documento",
    example: "licencia",
  })
  tipo: ConductorDocumentoTipo;

  @ApiProperty({ example: "Documento 1", description: "Nombre del documento" })
  nombre: string;

  @ApiProperty({
    example: "https://storage.example.com/documentos/licencia-A123456.pdf",
    description: "URL del documento",
  })
  url: string;

  @ApiProperty({
    example: "2025-12-31",
    description: "Fecha de expiración del documento",
    nullable: true,
  })
  fechaExpiracion: string | null;

  @ApiProperty({
    example: "2023-01-15",
    description: "Fecha de emisión del documento",
    nullable: true,
  })
  fechaEmision: string | null;

  @ApiProperty({
    example: "2024-01-15T10:30:00Z",
    description: "Fecha de creación",
  })
  creadoEn: Date;

  @ApiProperty({
    example: "2024-01-15T10:30:00Z",
    description: "Fecha de última actualización",
  })
  actualizadoEn: Date;
}
