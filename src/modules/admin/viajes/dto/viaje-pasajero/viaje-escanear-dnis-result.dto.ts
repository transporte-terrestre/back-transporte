import { ApiProperty } from '@nestjs/swagger';
import { ViajePasajeroResultDto } from './viaje-pasajero-result.dto';

export class ScanDniResultItem {
  @ApiProperty({ example: '72750623', description: 'Número de DNI extraído' })
  dni?: string;

  @ApiProperty({ example: 'ERICK STIP', description: 'Nombres extraídos' })
  nombres?: string;

  @ApiProperty({ example: 'FLORES SANTOS', description: 'Apellidos extraídos' })
  apellidos?: string;

  @ApiProperty({ example: true, description: 'Indica si se pudo procesar la imagen' })
  matched: boolean;

  @ApiProperty({ example: 'CREADO_AD_HOC', description: 'Estado final del procesamiento' })
  status: string;

  @ApiProperty({ example: 'https://ejemplo.com/dni.jpg', required: false, description: 'URL procesada si hubo error' })
  url?: string;

  @ApiProperty({ example: 'No se pudo extraer información', required: false, description: 'Mensaje de error' })
  error?: string;
}

export class ViajeEscanearDnisResultDto {
  @ApiProperty({ example: true })
  exito: boolean;

  @ApiProperty({ example: 'Procesamiento de DNIs completado' })
  mensaje: string;

  @ApiProperty({ type: [ScanDniResultItem] })
  resultados: ScanDniResultItem[];

  @ApiProperty({ type: [ViajePasajeroResultDto] })
  pasajerosActualizados: ViajePasajeroResultDto[];
}
