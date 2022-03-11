import { Field, ObjectType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Model, model } from "mongoose"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { MongooseForeignKeyProp } from "src/common/decorators/mongoose/id-reference.prop"
import { MongooseCreatedAtProp } from "src/common/decorators/mongoose/timestamps.decorator"
import { IEntityWithId } from "src/common/interface/entities.interface"

export type SessionDocument = Document & Session
export type SessionModel = Model<SessionDocument>

@Schema()
@ObjectType()
export class Session implements IEntityWithId {
  @Field()
  @MongooseIdProp()
  id!: string

  @Field()
  @Prop({ required: true })
  userAgent!: string

  @Field()
  @MongooseForeignKeyProp()
  userId!: string

  @Field()
  @MongooseCreatedAtProp()
  createdAt!: Date
}

export const SessionSchema = SchemaFactory.createForClass(Session)
export const sessionModel = model(Session.name, SessionSchema) as unknown as SessionModel
