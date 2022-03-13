import { Field, InputType, ObjectType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { MaxLength, Min, MinLength } from "class-validator"
import { Document, Model, model, FilterQuery } from "mongoose"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { MongooseForeignKeyProp } from "src/common/decorators/mongoose/id-reference.prop"
import { UUID_V4 } from "src/common/decorators/validation/class-validator"
import { IEntityWithId } from "src/common/interface/entities.interface"
import { Range } from "src/common/interface/graphql.interface"
import {
  MongooseSortingOrder,
  MongooseSortingOrdersEnum
} from "src/common/interface/mongoose.interface"
import { IPaginatedEntities } from "src/common/interface/paginated-entity.interface"
import { ProductFuzzyModel } from "./products.service"

export type ProductDocument = Document & Product
export type ProductModel = Model<ProductDocument>
export type ProductFilterQuery = FilterQuery<ProductDocument>

@ObjectType()
@InputType("ProductInput")
@Schema({ timestamps: true })
export class Product implements IEntityWithId {
  @Field()
  @MongooseIdProp()
  id!: string

  @MinLength(2)
  @MaxLength(64)
  @Field()
  @Prop()
  name!: string

  @Field()
  @MongooseForeignKeyProp()
  userId!: string

  @UUID_V4()
  @Field()
  @MongooseForeignKeyProp()
  categoryId!: string

  @MaxLength(1000)
  @Field({ nullable: true })
  @Prop()
  description?: string

  @Field(() => [String])
  @Prop()
  imagesUrls!: string[]

  @Min(0)
  @Field({ defaultValue: 0 })
  @Prop()
  price!: number

  @Field()
  createdAt!: Date
}

@ObjectType()
export class PaginatedProducts extends IPaginatedEntities<Product> {
  @Field(() => [Product])
  data!: Product[]
  @Field()
  totalResultsCount!: number
}

@InputType()
export class ProductSorting {
  @Field(() => MongooseSortingOrdersEnum, { nullable: true })
  price?: MongooseSortingOrder

  @Field(() => MongooseSortingOrdersEnum, { nullable: true })
  name?: MongooseSortingOrder

  @Field(() => MongooseSortingOrdersEnum, { nullable: true })
  createdAt?: MongooseSortingOrder
}

@InputType()
export class ProductFilters {
  @Field(() => Range, { nullable: true })
  priceRange?: Range
}

export const ProductSchema = SchemaFactory.createForClass(Product)
export const productModel = model(Product.name, ProductSchema) as unknown as ProductFuzzyModel
