import { ForbiddenException, Injectable } from "@nestjs/common"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"
import { MongooseService } from "src/common/service/mongoose.service"
import { Chat } from "./chat.entity"

export interface CreateChatInput {
  peersIds: string[]
}

@Injectable()
export class ChatsService extends MongooseService<Chat> {
  constructor(modelsInjector: ModelsInjectorService) {
    super(modelsInjector.chatModel)
  }

  async createIfNotExists(input: CreateChatInput): Promise<Chat> {
    const { peersIds } = input
    try {
      const existingChat = await this.findOneOrFail({ peersIds: { $all: peersIds } })
      return existingChat
    } catch {
      const createdChat = await this.createChat(input)
      return createdChat
    }
  }

  failIfViewMessageDenied({ chat, requesterId }: { chat: Chat; requesterId: string }) {
    const isChatPeer = chat.peersIds.includes(requesterId)
    if (isChatPeer === false) {
      throw new ForbiddenException("You are not member of this chat")
    }
  }

  private async createChat(input: CreateChatInput): Promise<Chat> {
    return await this.createOrFail(input)
  }
}
