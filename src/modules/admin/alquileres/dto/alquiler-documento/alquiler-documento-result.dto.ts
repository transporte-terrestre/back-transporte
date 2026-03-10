import { ApiProperty } from '@nestjs/swagger';

export class AlquilerDocumentoResultDto {
  @ApiProperty() id: number;
  @ApiProperty() alquilerId: number;
  @ApiProperty({ enum: ['contrato', 'guia_remision', 'acta_entrega', 'acta_devolucion', 'comprobante_pago', 'otros'] }) tipo: string;
  @ApiProperty() nombre: string;
  @ApiProperty() url: string;
  @ApiProperty() creadoEn: Date;
  @ApiProperty() actualizadoEn: Date;
}
