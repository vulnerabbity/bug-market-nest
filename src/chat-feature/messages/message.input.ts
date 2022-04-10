import { InputType, OmitType, PickType } from "@nestjs/graphql"
import { ChatMessage } from "./message.entity"

@InputType()
export class SendChatMessageInput extends OmitType(ChatMessage, [
  "id",
  "chatId",
  "createdAt",
  "updatedAt"
]) {}

@InputType()
export class DeleteChatMessageInput extends PickType(ChatMessage, ["id"]) {}
