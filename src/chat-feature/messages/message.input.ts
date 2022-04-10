import { InputType, ObjectType, OmitType, PickType } from "@nestjs/graphql"
import { ChatMessage } from "./message.entity"

@InputType()
class ChatMessageInput extends OmitType(ChatMessage, []) {}

@InputType()
export class SendChatMessageInput extends PickType(ChatMessageInput, ["text", "userId"]) {}
