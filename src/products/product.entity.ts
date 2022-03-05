import { Field, InputType, ObjectType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { ObjectId } from "mongodb"
import { Document, Model, FilterQuery } from "mongoose"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { MongooseIdReference } from "src/common/decorators/mongoose/id-reference.prop"

export type ProductDocument = Document & Product
export type ProductModel = Model<ProductDocument>
export type ProductFilterQuery = FilterQuery<ProductDocument>

@ObjectType()
@InputType("ProductInput")
@Schema()
export class Product {
  _id!: ObjectId

  @Field()
  @MongooseIdProp()
  id!: string

  @Field()
  @MongooseIdReference()
  userId!: string

  @Field()
  @Prop()
  name!: string

  @Field()
  @Prop({ required: true })
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
