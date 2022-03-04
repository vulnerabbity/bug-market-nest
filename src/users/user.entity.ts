import { Field, ObjectType, registerEnumType } from "@nestjs/graphql"
import { InjectModel, Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Model, model, FilterQuery } from "mongoose"
import { ObjectId } from "mongodb"
import { MongooseHashProp } from "src/common/decorators/mongoose/hash-prop.decorator"
import { Product } from "src/products/product.entity"

export enum UserRolesEnum {
  SELLER = "seller",
  ADMIN = "admin",
  SUPER_ADMIN = "super admin"
}

registerEnumType(UserRolesEnum, { name: "UserRolesEnum" })

// converts enum to union type
export type UserRole = `${UserRolesEnum}`

export type UserDocument = User & Document

export type UserModel = Model<UserDocument>

export type UserFilterQuery = FilterQuery<UserDocument>

@ObjectType()
@Schema()
export class User {
  _id!: ObjectId

  @Field()
  get id(): string {
    return String(this._id)
  }
  set id(value: string) {
    this._id = new ObjectId(value)
  }

  @Prop({ unique: true, immutable: true, required: true })
  username!: string

  @Field({ defaultValue: "N/A" })
  @Prop()
  name!: string

  // TODO: Add length validation
  @MongooseHashProp({ required: true })
  password!: string

  @Field()
  @Prop({
    default: function (this: User) {
      return `${this.id}_avatar`
    },
    index: true
  })
  avatarUrl!: string

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
  // TODO: ADD PHONE
}

export const UserSchema = SchemaFactory.createForClass(User)
export const userModel = model(User.name, UserSchema) as unknown as UserModel
