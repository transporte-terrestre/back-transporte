import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { alquilerDocumentosTipo, AlquilerDocumentoDTO } from '@db/tables/alquiler-documento.table';

export class AlquilerDocumentoCreateDto implements Omit<AlquilerDocumentoDTO, 'id' | 'creadoEn' | 'actualizadoEn'> {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  alquilerId: number;

  @ApiPropertyOptional({ enum: alquilerDocumentosTipo.enumValues, example: 'contrato' })
  @IsOptional()
  @IsEnum(alquilerDocumentosTipo.enumValues)
  tipo?: (typeof alquilerDocumentosTipo.enumValues)[number];

  @ApiProperty({ example: 'Contrato de alquiler' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'https://cdn.midominio.com/docs/contrato.pdf' })
  @IsString()
  @IsNotEmpty()
  url: string;
}
