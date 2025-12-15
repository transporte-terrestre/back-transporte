import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsInt,
  IsIn,
  IsString,
  IsDateString,
  IsOptional,
} from "class-validator";
import {
  ClienteDocumentoDTO,
  clienteDocumentosTipo,
} from "@model/tables/cliente-documento.model";
import type { ClienteDocumentoTipo } from "@model/tables/cliente-documento.model";

export class ClienteDocumentoCreateDto
  implements Omit<ClienteDocumentoDTO, "id" | "creadoEn" | "actualizadoEn">
{
  @ApiProperty({ example: 1, description: "ID del cliente" })
  @IsInt()
  @IsNotEmpty()
  clienteId: number;

  @ApiProperty({
    enum: clienteDocumentosTipo.enumValues,
    description: "Tipo de documento",
    default: clienteDocumentosTipo.enumValues[0],
  })
  @IsIn(clienteDocumentosTipo.enumValues, { each: true })
  @IsNotEmpty()
  tipo: ClienteDocumentoTipo;

  @ApiProperty({
    example: "https://storage.example.com/documentos/dni-12345678.pdf",
    description: "URL del documento",
  })
  @IsString()
  @IsNotEmpty()
  url: string;

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
