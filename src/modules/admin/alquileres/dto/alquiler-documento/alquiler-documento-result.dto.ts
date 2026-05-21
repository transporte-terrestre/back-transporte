import { ApiProperty } from '@nestjs/swagger';

export class AlquilerDocumentoResultDto {
  @ApiProperty() id: number;
  @ApiProperty() alquilerId: number;
  @ApiProperty({ enum: ['contrato', 'documentacion', 'guia_remision', 'acta_entrega', 'acta_devolucion', 'comprobante_pago', 'otros'] }) tipo: string;
  @ApiProperty() nombre: string;
  @ApiProperty() url: string;
  @ApiProperty({ required: false, nullable: true }) fechaExpiracion?: string | null;
  @ApiProperty({ required: false, nullable: true }) fechaEmision?: string | null;
  @ApiProperty() creadoEn: Date;
  @ApiProperty() actualizadoEn: Date;
}
