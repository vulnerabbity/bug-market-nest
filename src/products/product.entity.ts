import { Field, InputType, ObjectType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { IsOptional, MaxLength, Min, MinLength } from "class-validator"
import { Document, Model, model, FilterQuery } from "mongoose"
import { MongooseFuzzyModel } from "mongoose-fuzzy-search"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { MongooseForeignKeyProp } from "src/common/decorators/mongoose/id-reference.prop"
import { IEntityWithId } from "src/common/interface/entities.interface"
import { Range } from "src/common/interface/graphql.interface"
import {
  MongooseSortingOrder,
  MongooseSortingOrdersEnum
} from "src/common/interface/mongoose.interface"
import { IPaginatedEntities } from "src/common/interface/paginated-entity.interface"

export type ProductDocument = Document & Product
export type ProductFilterQuery = FilterQuery<ProductDocument>
export type ProductModel = Model<ProductDocument>
export type ProductFuzzyModel = ProductModel & MongooseFuzzyModel<ProductDocument>

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

  @Field()
  @Prop({ required: true, index: true })
  categoryName!: string

  @IsOptional()
  @MaxLength(1000)
  @Field({ nullable: true })
  @Prop()
  description?: string

  @Field(() => [String])
  imagesUrls!: string[]

  @Field(() => [String])
  @Prop()
  imagesIds!: string[]

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

  @Field(() => String, { nullable: true })
  categoryName?: string
}

export const ProductSchema = SchemaFactory.createForClass(Product)
export const productModel = model(Product.name, ProductSchema) as unknown as ProductFuzzyModel
