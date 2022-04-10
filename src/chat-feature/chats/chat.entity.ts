import { Field, ObjectType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { IEntityWithId } from "src/common/interface/entities.interface"
import { Document, Model, model, FilterQuery } from "mongoose"

export type ChatDocument = Chat & Document
export type ChatModel = Model<ChatDocument>
export type ChatFilterQuery = FilterQuery<ChatDocument>

@ObjectType()
@Schema()
export class Chat implements IEntityWithId {
  @MongooseIdProp()
  id!: string

  @Prop({ required: true, index: true })
  peersIds!: String[]
}

export const ChatSchema = SchemaFactory.createForClass(Chat)
export const chatModel = model(Chat.name, ChatSchema) as unknown as ChatModel
