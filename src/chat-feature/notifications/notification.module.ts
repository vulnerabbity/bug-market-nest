import { Module } from "@nestjs/common"
import { ChatNotificationsGateway } from "./notifications.gateway"

const passThroughProviders = [ChatNotificationsGateway]

@Module({
  providers: passThroughProviders,
  exports: passThroughProviders
})
export class ChatNotificationsModule {}
