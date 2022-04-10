import { Module } from "@nestjs/common"
import { ChatsModule } from "./chats/chats.module"
import { ChatMessagesModule } from "./messages/messages.module"

const imports = [ChatsModule, ChatMessagesModule]

@Module({
  imports
})
export class ChatFeatureModule {}
