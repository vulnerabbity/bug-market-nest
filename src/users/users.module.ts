import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AbilitiesModule } from "src/auth/authorization/abilities/abilities.module"
import { PublicFilesModule } from "src/files/public/public-files.module"
import { ProductsModule } from "src/products/products.module"
import { User, UserSchema } from "./user.entity"
import { UsersController } from "./users.controller"
import { UsersResolver } from "./users.resolver"
import { UsersService } from "./users.service"

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    PublicFilesModule,
    AbilitiesModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  exports: [UsersService, UsersResolver]
})
export class UsersModule {}
