import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsObject } from 'class-validator';

export class DescargarDocumentosDto {
  @ApiProperty({
    example: { 1: ['dni', 'licencia'], 2: ['dni'] },
    description: 'Diccionario con el ID del conductor y los tipos de documentos a descargar',
    required: false
  })
  @IsOptional()
  @IsObject()
  conductores?: Record<number, string[]>;

  @ApiProperty({
    example: { 15: ['soat', 'tarjeta_propiedad'] },
    description: 'Diccionario con el ID del vehículo y los tipos de documentos a descargar',
    required: false
  })
  @IsOptional()
  @IsObject()
  vehiculos?: Record<number, string[]>;
}
