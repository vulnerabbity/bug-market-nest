import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { CategoriesService } from "./categories.service"
import { CategoriesResolver } from "./categories.resolver"
import { Category, CategorySchema } from "./category.entity"
import { ProductsModule } from "src/products/products.module"
import { AbilitiesModule } from "src/auth/authorization/abilities/abilities.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    ProductsModule,
    AbilitiesModule
  ],
  providers: [CategoriesService, CategoriesResolver]
})
export class CategoriesModule {}
