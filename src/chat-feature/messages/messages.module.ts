import { Global, Module, Provider } from "@nestjs/common"
import { UsersModule } from "src/users/users.module"
import { ChatMessagesGateway } from "./messages.gateway"
import { ChatMessagesResolver } from "./messages.resolver"
import { ChatMessagesService } from "./messages.service"

const providers: Provider[] = [ChatMessagesResolver, ChatMessagesService, ChatMessagesGateway]

@Global()
@Module({
  imports: [UsersModule],
  providers
})
export class ChatMessagesModule {}
