import { IsInt, IsOptional, IsDate, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { VehiculoConductorDTO } from "@model/tables/vehiculo-conductor.model";

export class VehiculoConductorCreateDto
  implements Omit<VehiculoConductorDTO, "id" | "creadoEn" | "actualizadoEn">
{
  @ApiProperty({ example: 1, description: "Vehicle ID" })
  @IsInt()
  @IsNotEmpty()
  vehiculoId: number;

  @ApiProperty({ example: 1, description: "Driver ID" })
  @IsInt()
  @IsNotEmpty()
  conductorId: number;

  @ApiPropertyOptional({
    example: "2025-01-01T10:00:00Z",
    description: "Assignment date",
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  asignadoEn: Date;

  @ApiPropertyOptional({
    example: "2025-01-01T18:00:00Z",
    description: "Unassignment date",
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  desasignadoEn: Date | null;
}
