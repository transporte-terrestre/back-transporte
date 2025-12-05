import { ApiProperty } from "@nestjs/swagger";

export class UploadResultDto {
  @ApiProperty({ example: "images/abc123", description: "Public ID del archivo en Cloudinary" })
  publicId: string;

  @ApiProperty({ example: "https://res.cloudinary.com/...", description: "URL del archivo" })
  url: string;

  @ApiProperty({ example: "https://res.cloudinary.com/...", description: "URL segura del archivo" })
  secureUrl: string;

  @ApiProperty({ example: "jpg", description: "Formato del archivo" })
  format: string;

  @ApiProperty({ example: 1024, description: "Ancho de la imagen (solo para imágenes)" })
  width?: number;

  @ApiProperty({ example: 768, description: "Alto de la imagen (solo para imágenes)" })
  height?: number;

  @ApiProperty({ example: 102400, description: "Tamaño del archivo en bytes" })
  bytes: number;

  @ApiProperty({ example: "image", description: "Tipo de recurso" })
  resourceType: string;

  @ApiProperty({ example: "2024-01-01T00:00:00.000Z", description: "Fecha de creación" })
  createdAt: string;
}
