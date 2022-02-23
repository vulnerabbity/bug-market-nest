import { Field, ObjectType, OmitType, PickType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Model } from "mongoose"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { MongooseUserIdProp } from "src/common/decorators/mongoose/user-id-prop.decorator"
import { IPaginatedEntity } from "src/common/interface/paginated-entity.interface"
import { User } from "src/users/user.entity"

export type ProductDocument = Document & Product
export type ProductModel = Model<ProductDocument>

@ObjectType()
@Schema()
export class Product implements IPaginatedEntity {
  @Field()
  @MongooseIdProp()
  id!: string

  @Field()
  @MongooseUserIdProp()
  userId!: string

  @Field(() => User)
  author!: User

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
