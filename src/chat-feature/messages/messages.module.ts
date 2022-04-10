import { Module, Provider } from "@nestjs/common"
import { ChatMessagesResolver } from "./messages.resolver"
import { ChatMessagesService } from "./messages.service"

const providers: Provider[] = [ChatMessagesResolver, ChatMessagesService]

@Module({
  providers
})
export class ChatMessagesModule {}
