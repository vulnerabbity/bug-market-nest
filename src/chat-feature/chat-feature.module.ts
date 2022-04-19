import { Global, Module } from "@nestjs/common"
import { ChatsModule } from "./chats/chats.module"
import { ChatMessagesModule } from "./messages/messages.module"
import { ChatNotificationsModule } from "./notifications/notification.module"

const passThroughModules = [ChatsModule, ChatMessagesModule, ChatNotificationsModule]

@Global()
@Module({
  imports: passThroughModules,
  exports: passThroughModules
})
export class ChatFeatureModule {}
