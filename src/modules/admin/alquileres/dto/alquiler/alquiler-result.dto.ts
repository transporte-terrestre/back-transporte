import { ApiProperty } from '@nestjs/swagger';

export class AlquilerVehiculoDto {
  @ApiProperty() id: number;
  @ApiProperty() placa: string;
  @ApiProperty() marca: string;
  @ApiProperty() modelo: string;
}

export class AlquilerProveedorDto {
  @ApiProperty() id: number;
  @ApiProperty() nombreCompleto: string;
  @ApiProperty() dni: string;
  @ApiProperty({ required: false }) ruc?: string | null;
}

export class AlquilerResultDto {
  @ApiProperty() id: number;

  @ApiProperty() vehiculoId: number;

  @ApiProperty() fechaInicio: Date;
  @ApiProperty({ required: false }) fechaFin?: Date | null;

  @ApiProperty({ required: false }) monto?: string | null;
  @ApiProperty({ required: false }) observaciones?: string | null;
  @ApiProperty() estado: string;

  @ApiProperty() creadoEn: Date;
  @ApiProperty() actualizadoEn: Date;

  @ApiProperty({ type: AlquilerVehiculoDto, required: false }) vehiculo?: AlquilerVehiculoDto;
  @ApiProperty({ type: AlquilerProveedorDto, required: false }) proveedor?: AlquilerProveedorDto;
}
