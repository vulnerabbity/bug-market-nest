import { Field, ObjectType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { Document, Model, model, FilterQuery } from "mongoose"
import { MongooseForeignKeyProp } from "src/common/decorators/mongoose/id-reference.prop"
import { IEntityWithId } from "src/common/interface/entities.interface"

export type ChatMessageDocument = ChatMessage & Document

export type ChatMessageModel = Model<ChatMessageDocument>

export type ChatMessageFilterQuery = FilterQuery<ChatMessageDocument>

@ObjectType()
@Schema({
  timestamps: true
})
export class ChatMessage implements IEntityWithId {
  @Field()
  @MongooseIdProp()
  id!: string

  @Field()
  @MongooseForeignKeyProp()
  chatId!: string

  @Field()
  @MongooseForeignKeyProp()
  userId!: string

  @Field()
  @Prop({ required: true })
  text!: string

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage)

export const chatMessageModel = model(
  ChatMessage.name,
  ChatMessageSchema
) as unknown as ChatMessageModel
