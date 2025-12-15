import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ClienteDocumentoResultDto } from "./cliente-documento-result.dto";
import type { ClienteDocumentoTipo } from "@model/tables/cliente-documento.model";

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

  @ApiProperty({ example: "12345678", description: "DNI del cliente" })
  dni: string;

  @ApiProperty({ example: "Juan Carlos", description: "Nombres del cliente" })
  nombres: string;

  @ApiProperty({
    example: "Pérez García",
    description: "Apellidos del cliente",
  })
  apellidos: string;

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
