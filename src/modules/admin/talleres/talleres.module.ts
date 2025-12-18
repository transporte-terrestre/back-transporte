import { Module } from "@nestjs/common";
import { TalleresService } from "./talleres.service";
import { TalleresController } from "./talleres.controller";
import { TallerRepository } from "@repository/taller.repository";

@Module({
  controllers: [TalleresController],
  providers: [TalleresService, TallerRepository],
  exports: [TalleresService],
})
export class TalleresModule {}
