import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ClienteDTO } from "@model/tables/cliente.model";

export class ClienteCreateDto
  implements Omit<ClienteDTO, "id" | "creadoEn" | "actualizadoEn">
{
  @ApiProperty({ example: "12345678", description: "DNI del cliente" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dni: string;

  @ApiProperty({ example: "Juan", description: "Nombre del cliente" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: "Pérez", description: "Apellido del cliente" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  @ApiPropertyOptional({ example: "juan.perez@example.com", description: "Email del cliente" })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string | null;

  @ApiPropertyOptional({ example: "987654321", description: "Teléfono del cliente" })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string | null;

  @ApiPropertyOptional({ example: "Av. Principal 123", description: "Dirección del cliente" })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  direccion?: string | null;

  @ApiPropertyOptional({ 
    example: ["https://res.cloudinary.com/xxx/image.jpg"], 
    description: "Lista de URLs de imágenes del cliente",
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagenes?: string[];
}
