import { Module } from "@nestjs/common"
import { AbilitiesModule } from "src/auth/authorization/abilities/abilities.module"
import { ImageCompressionModule } from "src/files/image-compression/image-compression.module"
import { PublicFilesModule } from "src/files/public/public-files.module"
import { LocationsModule } from "src/locations/locations.module"
import { ProductsModule } from "src/products/products.module"
import { UsersController } from "./users.controller"
import { UsersResolver } from "./users.resolver"
import { UsersService } from "./users.service"

@Module({
  imports: [
    ProductsModule,
    PublicFilesModule,
    AbilitiesModule,
    LocationsModule,
    ImageCompressionModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  exports: [UsersService, UsersResolver]
})
export class UsersModule {}
