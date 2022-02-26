import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { PublicFile, PublicFileSchema } from "./public-file.entity"
import { PublicFilesController } from "./public-files.controller"
import { PublicFilesService } from "./public-files.service"

@Module({
  imports: [MongooseModule.forFeature([{ name: PublicFile.name, schema: PublicFileSchema }])],
  controllers: [PublicFilesController],
  providers: [PublicFilesService],
  exports: [PublicFilesService]
})
export class PublicFilesModule {}
