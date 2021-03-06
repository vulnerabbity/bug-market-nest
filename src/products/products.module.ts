import { Module } from "@nestjs/common"
import { AbilitiesModule } from "src/auth/authorization/abilities/abilities.module"
import { ImageCompressionModule } from "src/files/image-compression/image-compression.module"
import { PublicFilesModule } from "src/files/public/public-files.module"
import { ProductsController } from "./products.controller"
import { ProductsResolver } from "./products.resolver"
import { ProductsService } from "./products.service"

@Module({
  imports: [AbilitiesModule, PublicFilesModule, ImageCompressionModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsResolver],
  exports: [ProductsService]
})
export class ProductsModule {}
