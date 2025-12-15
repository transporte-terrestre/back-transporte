import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ClienteDocumentoResultDto } from "./cliente-documento-result.dto";
import { clientesTipoDocumento } from "@model/tables/cliente.model";
import type { ClienteDocumentoTipo } from "@model/tables/cliente-documento.model";
import type { ClienteTipoDocumento } from "@model/tables/cliente.model";

export class DocumentosAgrupadosClienteDto
  implements Record<ClienteDocumentoTipo, ClienteDocumentoResultDto[]>
{
  @ApiProperty({ type: [ClienteDocumentoResultDto] })
  dni: ClienteDocumentoResultDto[];

  @ApiProperty({ type: [ClienteDocumentoResultDto] })
  ruc: ClienteDocumentoResultDto[];

  @ApiProperty({ type: [ClienteDocumentoResultDto] })
  contrato: ClienteDocumentoResultDto[];

  @ApiProperty({ type: [ClienteDocumentoResultDto] })
  carta_compromiso: ClienteDocumentoResultDto[];

  @ApiProperty({ type: [ClienteDocumentoResultDto] })
  ficha_ruc: ClienteDocumentoResultDto[];

  @ApiProperty({ type: [ClienteDocumentoResultDto] })
  otros: ClienteDocumentoResultDto[];
}

export class ClienteResultDto {
  @ApiProperty({ example: 1, description: "ID del cliente" })
  id: number;

  @ApiProperty({
    enum: clientesTipoDocumento.enumValues,
    example: clientesTipoDocumento.enumValues[0],
    description: "Tipo de documento",
  })
  tipoDocumento: ClienteTipoDocumento;

  @ApiProperty({ example: "12345678", description: "DNI del cliente" })
  dni: string | null;

  @ApiProperty({ example: "20123456789", description: "RUC del cliente" })
  ruc: string | null;

  @ApiProperty({ example: "Juan Carlos", description: "Nombres del cliente" })
  nombres: string | null;

  @ApiProperty({
    example: "Pérez García",
    description: "Apellidos del cliente",
  })
  apellidos: string | null;

  @ApiProperty({
    example: "Empresa SAC",
    description: "Razón Social del cliente",
  })
  razonSocial: string | null;

  @ApiProperty({
    example: "Juan Carlos Pérez García",
    description: "Nombre completo del cliente",
  })
  nombreCompleto: string;

  @ApiPropertyOptional({
    example: "juan.perez@example.com",
    description: "Email del cliente",
  })
  email: string | null;

  @ApiPropertyOptional({
    example: "987654321",
    description: "Teléfono del cliente",
  })
  telefono: string | null;

  @ApiPropertyOptional({
    example: "Av. Principal 123",
    description: "Dirección del cliente",
  })
  direccion: string | null;

  @ApiProperty({
    example: ["https://res.cloudinary.com/xxx/image.jpg"],
    description: "Lista de URLs de imágenes del cliente",
    type: [String],
  })
  imagenes: string[];

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Fecha de creación",
  })
  creadoEn: Date;

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Fecha de actualización",
  })
  actualizadoEn: Date;

  @ApiProperty({ description: "Client documents grouped by type" })
  documentos: DocumentosAgrupadosClienteDto;
}
