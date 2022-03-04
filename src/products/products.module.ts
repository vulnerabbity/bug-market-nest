import { forwardRef, Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AbilitiesModule } from "src/auth/authorization/abilities/abilities.module"
import { CategoriesModule } from "src/categories/categories.module"
import { Category, CategorySchema } from "src/categories/category.entity"
import { Product, ProductSchema } from "./product.entity"
import { ProductsResolver } from "./products.resolver"
import { ProductsService } from "./products.service"

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{ name: Product.name, useFactory: ProductSchemaSetup }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    AbilitiesModule
  ],
  providers: [ProductsService, ProductsResolver],
  exports: [ProductsService]
})
export class ProductsModule {}

function ProductSchemaSetup() {
  const schema = ProductSchema
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  schema.plugin(require("mongoose-fuzzy-searching"), {
    fields: [
      { name: "name", weight: 10 },
      { name: "description", minSize: 4 }
    ]
  })

  return schema
}
