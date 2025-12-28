import { ApiProperty } from "@nestjs/swagger";
import { usuariosRol } from "@model/tables/usuario.model";
import { UsuarioDocumentoResultDto } from "./usuario-documento-result.dto";

import type { UsuarioRol } from "@model/tables/usuario.model";
import type { UsuarioDocumentoTipo } from "@model/tables/usuario-documento.model";


export class DocumentosAgrupadosDto
  implements Record<UsuarioDocumentoTipo, UsuarioDocumentoResultDto[]>
{
  @ApiProperty({ type: [UsuarioDocumentoResultDto] })
  dni: UsuarioDocumentoResultDto[];

  @ApiProperty({ type: [UsuarioDocumentoResultDto] })
  seguro_vida_ley: UsuarioDocumentoResultDto[];

  @ApiProperty({ type: [UsuarioDocumentoResultDto] })
  sctr: UsuarioDocumentoResultDto[];

  @ApiProperty({ type: [UsuarioDocumentoResultDto] })
  examen_medico: UsuarioDocumentoResultDto[];

  @ApiProperty({ type: [UsuarioDocumentoResultDto] })
  induccion_general: UsuarioDocumentoResultDto[];
}

export class UsuarioResultDto {
  @ApiProperty({ example: 1, description: "User ID" })
  id: number;

  @ApiProperty({ example: "John Michael", description: "User first names" })
  nombres: string;

  @ApiProperty({ example: "Doe Smith", description: "User last names" })
  apellidos: string;

  @ApiProperty({
    example: "John Michael Doe Smith",
    description: "User full name",
  })
  nombreCompleto: string;

  @ApiProperty({ example: "john.doe@example.com", description: "User email" })
  email: string;

  @ApiProperty({
    example: [usuariosRol.enumValues[0]],
    enum: usuariosRol.enumValues,
    
    description: "User roles",
    isArray: true,
  })
  roles: UsuarioRol[];

  @ApiProperty({
    example: ["https://storage.example.com/fotocheck/1.jpg"],
    description: "User fotocheck URLs",
    isArray: true,
  })
  fotocheck: string[];

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

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Deletion date (if applicable)",
    nullable: true,
  })
  eliminadoEn: Date | null;

  @ApiProperty({
    description: "User documents grouped by type",
    type: DocumentosAgrupadosDto,
  })
  documentos: DocumentosAgrupadosDto;
}
