import { Module } from "@nestjs/common"
import { CategoriesService } from "./categories.service"
import { CategoriesResolver } from "./categories.resolver"
import { ProductsModule } from "src/products/products.module"
import { AbilitiesModule } from "src/auth/authorization/abilities/abilities.module"

@Module({
  imports: [ProductsModule, AbilitiesModule],
  providers: [CategoriesService, CategoriesResolver]
})
export class CategoriesModule {}
