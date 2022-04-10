import { Global, Module, Provider } from "@nestjs/common"
import { ChatsResolver } from "./chats.resolver"
import { ChatsService } from "./chats.service"

const providers: Provider[] = [ChatsService, ChatsResolver]
const chatExports: Provider[] = [ChatsService]

@Global()
@Module({
  providers,
  exports: chatExports
})
export class ChatsModule {}
