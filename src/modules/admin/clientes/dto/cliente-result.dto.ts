import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ClienteResultDto {
  @ApiProperty({ example: 1, description: "ID del cliente" })
  id: number;

  @ApiProperty({ example: "12345678", description: "DNI del cliente" })
  dni: string;

  @ApiProperty({ example: "Juan", description: "Nombre del cliente" })
  nombre: string;

  @ApiProperty({ example: "Pérez", description: "Apellido del cliente" })
  apellido: string;

  @ApiPropertyOptional({ example: "juan.perez@example.com", description: "Email del cliente" })
  email: string | null;

  @ApiPropertyOptional({ example: "987654321", description: "Teléfono del cliente" })
  telefono: string | null;

  @ApiPropertyOptional({ example: "Av. Principal 123", description: "Dirección del cliente" })
  direccion: string | null;

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
}
