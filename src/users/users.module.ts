import { Module } from "@nestjs/common"
import { AbilitiesModule } from "src/auth/authorization/abilities/abilities.module"
import { PublicFilesModule } from "src/files/public/public-files.module"
import { ProductsModule } from "src/products/products.module"
import { UsersController } from "./users.controller"
import { UsersResolver } from "./users.resolver"
import { UsersService } from "./users.service"

@Module({
  imports: [ProductsModule, PublicFilesModule, AbilitiesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  exports: [UsersService, UsersResolver]
})
export class UsersModule {}
