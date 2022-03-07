import { Field, InputType, ObjectType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { ObjectId } from "mongodb"
import { Document, Model, FilterQuery } from "mongoose"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { MongooseForeignKeyProp } from "src/common/decorators/mongoose/id-reference.prop"
import { IEntityWithId } from "src/common/interface/entities.interface"

export type ProductDocument = Document & Product
export type ProductModel = Model<ProductDocument>
export type ProductFilterQuery = FilterQuery<ProductDocument>

@ObjectType()
@InputType("ProductInput")
@Schema()
export class Product implements IEntityWithId {
  @Field()
  @MongooseIdProp()
  id!: string

  @Field()
  @Prop()
  name!: string

  @Field()
  @MongooseForeignKeyProp()
  userId!: string

  @Field()
  @MongooseForeignKeyProp()
  categoryId!: string

  @Field({ defaultValue: "N/A" })
  @Prop()
  description!: string

  @Field(() => [String])
  @Prop()
  imagesUrls!: string[]

  @Field({ defaultValue: 0 })
  @Prop()
  price!: number
}

export const ProductSchema = SchemaFactory.createForClass(Product)
