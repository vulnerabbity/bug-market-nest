import { Field, ObjectType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Model, model, FilterQuery } from "mongoose"
import { MongooseHashProp } from "src/common/decorators/mongoose/hash-prop.decorator"
import { Product } from "src/products/product.entity"
import { UserRole, UserRolesEnum } from "./user.interface"
import { IEntityWithId } from "src/common/interface/entities.interface"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { MaxLength, MinLength } from "class-validator"
import { Username } from "src/common/decorators/validation/class-validator"
import {
  Iso3166CountriesCodesEnum,
  Iso3166CountryCode
} from "src/locations/interfaces/iso-3166.interface"

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
  @Field({ nullable: true })
  @Prop()
  name?: string

  @MinLength(8)
  @MaxLength(64)
  @MongooseHashProp({ required: true })
  password!: string

  @Field({ nullable: true })
  @Prop()
  avatarUrl?: string

  @MaxLength(500)
  @Field({ nullable: true })
  @Prop()
  about?: string

  @Field(() => [UserRolesEnum])
  @Prop({ type: [typeof UserRolesEnum] })
  roles!: UserRole[]

  @Field({ nullable: true })
  @Prop({ index: true })
  cityId?: number

  @Field(() => Iso3166CountriesCodesEnum, { nullable: true })
  @Prop({ index: true })
  countryCode?: Iso3166CountryCode

  @Field(() => [Product])
  products!: Product[]
}

export const UserSchema = SchemaFactory.createForClass(User)
export const userModel = model(User.name, UserSchema) as unknown as UserModel
