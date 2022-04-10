import { Module, Provider } from "@nestjs/common"
import { ChatsResolver } from "./chats.resolver"
import { ChatsService } from "./chats.service"

const providers: Provider[] = [ChatsService, ChatsResolver]

@Module({
  providers
})
export class ChatsModule {}
