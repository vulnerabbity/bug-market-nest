import { Module } from "@nestjs/common"
import { ChatsModule } from "./chats/chats.module"
import { ChatMessagesModule } from "./messages/messages.module"
import { ChatNotificationsModule } from "./notifications/notification.module"

const imports = [ChatsModule, ChatMessagesModule, ChatNotificationsModule]

@Module({
  imports
})
export class ChatFeatureModule {}
