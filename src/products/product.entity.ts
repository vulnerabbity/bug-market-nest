import { Field, ObjectType, OmitType, PickType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Model } from "mongoose"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { MongooseIdReference } from "src/common/decorators/mongoose/id-reference.prop"
import { IPaginatedEntity } from "src/common/interface/paginated-entity.interface"

export type ProductDocument = Document & Product
export type ProductModel = Model<ProductDocument>

@ObjectType()
@Schema()
export class Product implements IPaginatedEntity {
  @Field()
  @MongooseIdProp()
  id!: string

  @Field()
  @MongooseIdReference()
  userId!: string

  @Field()
  @Prop()
  name!: string

  @Field({ defaultValue: "N/A" })
  @Prop()
  description!: string

  @Prop()
  photos!: string[]

  @Field({ defaultValue: 0 })
  @Prop()
  price!: number

  @Field()
  totalCount!: number
}

export const ProductSchema = SchemaFactory.createForClass(Product)
