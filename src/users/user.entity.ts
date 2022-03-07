import { Field, ObjectType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Model, model, FilterQuery } from "mongoose"
import { MongooseHashProp } from "src/common/decorators/mongoose/hash-prop.decorator"
import { Product } from "src/products/product.entity"
import { UserRole, UserRolesEnum } from "./user.interface"
import { IEntityWithId } from "src/common/interface/entities.interface"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { Max, MaxLength, MinLength } from "class-validator"
import { Username } from "src/common/decorators/validation/class-validator"

export type UserDocument = User & Document

export type UserModel = Model<UserDocument>

export type UserFilterQuery = FilterQuery<UserDocument>

@ObjectType()
@Schema()
export class User implements IEntityWithId {
  @Field()
  @MongooseIdProp()
  id!: string

  @Username()
  @MaxLength(32)
  @Prop({ unique: true, immutable: true, required: true })
  username!: string

  @MaxLength(32)
  @Field({ defaultValue: "N/A" })
  @Prop()
  name!: string

  @MinLength(8)
  @MaxLength(64)
  @MongooseHashProp({ required: true })
  password!: string

  @Field({ nullable: true })
  @Prop()
  avatarUrl?: string

  @Max(500)
  @Field({ defaultValue: "N/A" })
  @Prop()
  about!: string

  @Field(() => [UserRolesEnum])
  @Prop({ type: [typeof UserRolesEnum] })
  roles!: UserRole[]

  @Field(() => [Product])
  products!: Product[]

  // TODO: ADD COUNTRY
  // TODO: ADD CITY
}

export const UserSchema = SchemaFactory.createForClass(User)
export const userModel = model(User.name, UserSchema) as unknown as UserModel
