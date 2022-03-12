import { Global, Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Category, CategorySchema } from "src/categories/category.entity"
import { PublicFile, PublicFileSchema } from "src/files/public/public-file.entity"
import { Product, ProductSchema } from "src/products/product.entity"
import { Session, SessionSchema } from "src/sessions/session.entity"
import { User, UserSchema } from "src/users/user.entity"

const models = [
  MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Category.name, schema: CategorySchema },
    { name: PublicFile.name, schema: PublicFileSchema },
    { name: Session.name, schema: SessionSchema }
  ]),
  MongooseModule.forFeatureAsync([{ name: Product.name, useFactory: ProductSchemaSetup }])
]

/**
 * Contains definition of project database models
 */
@Module({
  imports: models,
  exports: models
})
export class ModelsModule {}

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
