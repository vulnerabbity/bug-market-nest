import { Resolver } from "@nestjs/graphql"
import { ChatMessage } from "./message.entity"

@Resolver(() => ChatMessage)
export class ChatMessagesResolver {
  constructor() {}
}
