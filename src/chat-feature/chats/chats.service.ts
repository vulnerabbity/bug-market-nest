import { ForbiddenException, Injectable } from "@nestjs/common"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"
import { Pagination } from "src/common/objects/pagination.input"
import { MongooseService } from "src/common/service/mongoose.service"
import { Chat, ChatFilterQuery, PaginatedChats } from "./chat.entity"

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
      const searchPeersFilter = { peersIds: { $all: peersIds } }
      const existingChat = await this.findOneOrFail(searchPeersFilter)
      return existingChat
    } catch {
      const createdChat = await this.createChat(input)
      return createdChat
    }
  }

  async getChatsPaginated(userId: string, pagination?: Pagination): Promise<PaginatedChats> {
    const ownChatsFilter = this.getOwnChatsFilter(userId)

    const latestFirst = { updatedAt: "desc" }

    const chats = await this.findManyPaginated({
      filter: ownChatsFilter,
      pagination,
      sorting: latestFirst
    })

    return chats
  }

  async getChatIds(userId: string): Promise<string[]> {
    const ownChatsFilter = this.getOwnChatsFilter(userId)

    const chats = await this.findMany({ filter: ownChatsFilter })
    const chatIds = chats.map(chat => chat.id)

    return chatIds
  }

  failIfViewMessageDenied({ chat, requesterId }: { chat: Chat; requesterId: string }) {
    const isChatPeer = chat.peersIds.includes(requesterId)
    if (isChatPeer === false) {
      throw new ForbiddenException("You are not member of this chat")
    }
  }

  async updateUpdatedAtOrFail(chatId: string, updatedAt = new Date()): Promise<Chat> {
    return await this.updateByIdOrFail(chatId, { updatedAt })
  }

  private async createChat(input: CreateChatInput): Promise<Chat> {
    return await this.createOrFail(input)
  }

  private getOwnChatsFilter(userId: string) {
    const filter: ChatFilterQuery = { peersIds: { $all: [userId] } }
    return filter
  }
}
