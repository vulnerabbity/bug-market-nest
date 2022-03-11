import { Field, ObjectType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { MaxLength, MinLength } from "class-validator"
import { Model, model, Document } from "mongoose"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { PaginatedProducts } from "src/products/product.entity"

export type CategoryDocument = Document & Category
export type CategoryModel = Model<CategoryDocument>

@Schema()
@ObjectType()
export class Category {
  @Field()
  @MongooseIdProp()
  id!: string

  @MinLength(2)
  @MaxLength(32)
  @Field()
  @Prop({ required: true, unique: true })
  name!: string

  @Field(() => PaginatedProducts)
  products!: PaginatedProducts[]
}

export const CategorySchema = SchemaFactory.createForClass(Category)
export const categoryModel = model(Category.name, CategorySchema) as unknown as CategoryModel
