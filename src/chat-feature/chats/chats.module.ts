import { Global, Module, Provider } from "@nestjs/common"
import { UsersModule } from "src/users/users.module"
import { ChatsEventsBus } from "./chats.events-bus"
import { ChatsEventsHandler } from "./chats.events-handler"
import { ChatsResolver } from "./chats.resolver"
import { ChatsService } from "./chats.service"

const providers: Provider[] = [ChatsService, ChatsResolver, ChatsEventsBus, ChatsEventsHandler]
const chatExports: Provider[] = [ChatsService, ChatsEventsBus]

@Global()
@Module({
  imports: [UsersModule],
  providers,
  exports: chatExports
})
export class ChatsModule {}
