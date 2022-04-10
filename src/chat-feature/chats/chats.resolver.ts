import { Resolver } from "@nestjs/graphql"
import { Chat } from "./chat.entity"

@Resolver(() => Chat)
export class ChatsResolver {}
