import { Global, Module, Provider } from "@nestjs/common"
import { UsersModule } from "src/users/users.module"
import { ChatsResolver } from "./chats.resolver"
import { ChatsService } from "./chats.service"

const providers: Provider[] = [ChatsService, ChatsResolver]
const chatExports: Provider[] = [ChatsService]

@Global()
@Module({
  imports: [UsersModule],
  providers,
  exports: chatExports
})
export class ChatsModule {}
