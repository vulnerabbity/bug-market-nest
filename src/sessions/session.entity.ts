import { Field, ObjectType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { MongooseCreatedAtProp } from "src/common/decorators/mongoose/timestamps.decorator"
import { UserIdProp } from "src/common/decorators/mongoose/user-id-prop.decorator"

export type SessionDocument = Document & Session

@Schema()
@ObjectType()
export class Session {
  @Field()
  @MongooseIdProp()
  id!: string

  @Field()
  @Prop({ required: true })
  userAgent!: string

  @Field()
  @UserIdProp()
  userId!: string

  @Field()
  @MongooseCreatedAtProp()
  createdAt!: Date
}

export const SessionSchema = SchemaFactory.createForClass(Session)
