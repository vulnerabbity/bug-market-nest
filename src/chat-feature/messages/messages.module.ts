import { Global, Module, Provider } from "@nestjs/common"
import { UsersModule } from "src/users/users.module"
import { ChatMessagesEventsBus } from "./messages.events-bus"
import { ChatMessagesEventsBusHandler } from "./messages.events-handler"
import { ChatMessagesGateway } from "./messages.gateway"
import { ChatMessagesResolver } from "./messages.resolver"
import { ChatMessagesService } from "./messages.service"

const providers: Provider[] = [
  ChatMessagesResolver,
  ChatMessagesService,
  ChatMessagesGateway,
  ChatMessagesEventsBus,
  ChatMessagesEventsBusHandler
]

@Global()
@Module({
  imports: [UsersModule],
  providers,
  exports: [ChatMessagesEventsBus]
})
export class ChatMessagesModule {}
