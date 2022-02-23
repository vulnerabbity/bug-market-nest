import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AbilitiesModule } from "src/auth/authorization/abilities/abilities.module"
import { UsersModule } from "src/users/users.module"
import { Product, ProductSchema } from "./product.entity"
import { ProductsResolver } from "./products.resolver"
import { ProductsService } from "./products.service"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    AbilitiesModule,
    UsersModule
  ],
  providers: [ProductsService, ProductsResolver],
  exports: [ProductsService]
})
export class ProductsModule {}
