import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString, IsDateString, IsOptional } from "class-validator";
import { clienteDocumentosTipo } from "@model/tables/cliente-documento.model";
import type { ClienteDocumentoTipo } from "@model/tables/cliente-documento.model";

export class ClienteDocumentoUpdateDto {
  @ApiProperty({
    description: "Tipo de documento",
    enum: clienteDocumentosTipo.enumValues,
    default: clienteDocumentosTipo.enumValues[0],
    required: false,
  })
  @IsIn(clienteDocumentosTipo.enumValues, { each: true })
  @IsOptional()
  tipo?: ClienteDocumentoTipo;

  @ApiProperty({
    example: "https://storage.example.com/documentos/dni-12345678.pdf",
    description: "URL del documento",
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    example: "2025-12-31",
    description: "Fecha de expiración del documento",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaExpiracion?: string;

  @ApiProperty({
    example: "2023-01-15",
    description: "Fecha de emisión del documento",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaEmision?: string;
}
