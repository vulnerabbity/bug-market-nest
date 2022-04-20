import { ForbiddenException, Injectable } from "@nestjs/common"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"
import { Pagination } from "src/common/objects/pagination.input"
import { MongooseService } from "src/common/service/mongoose.service"
import { UsersService } from "src/users/users.service"
import { ChatNotificationsGateway } from "../notifications/notifications.gateway"
import { Chat, ChatFilterQuery, PaginatedChats } from "./chat.entity"

export interface CreateChatInput {
  peersIds: string[]
}

export interface ChatPermissionsCheckInput {
  chat: Chat
  requesterId: string
}

@Injectable()
export class ChatsService extends MongooseService<Chat> {
  constructor(
    private modelsInjector: ModelsInjectorService,
    private usersService: UsersService,
    private chatsNotifications: ChatNotificationsGateway
  ) {
    super(modelsInjector.chatModel)
  }

  async initIfNotExistsAndNotifyOrFail(input: CreateChatInput): Promise<Chat> {
    let { peersIds } = input
    await this.failIfCantInit(input)

    try {
      const searchPeersFilter = { peersIds: { $all: peersIds } }
      const existingChat = await this.findOneOrFail(searchPeersFilter)
      return existingChat
    } catch {
      const createdChat = await this.createChat({ peersIds })
      this.chatsNotifications.emitChatCreated(createdChat)
      return createdChat
    }
  }

  async deleteChatAndNotifyOrFail(chatId: string): Promise<Chat> {
    const chat = await this.findByIdOrFail(chatId)
    await this.deleteByIdOrFail(chatId)

    await this.modelsInjector.chatMessageModel.deleteMany({ chatId })
    this.chatsNotifications.emitChatDeleted(chat)

    return chat
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

  failIfManageChatDenied({ chat, requesterId }: ChatPermissionsCheckInput) {
    const isChatPeer = chat.peersIds.includes(requesterId)
    if (isChatPeer === false) {
      throw new ForbiddenException("You cant manage this chat")
    }
  }

  async updateUpdatedAtOrFail(chatId: string, updatedAt = new Date()): Promise<Chat> {
    return await this.updateByIdOrFail(chatId, { updatedAt })
  }

  private async failIfCantInit(input: CreateChatInput) {
    return this.failIfPeersDontExists(input.peersIds)
  }

  private async failIfPeersDontExists(peersIds: string[]) {
    for (let peerId of peersIds) {
      await this.usersService.failIfIdNotExists(peerId)
    }
  }

  private async createChat(input: CreateChatInput): Promise<Chat> {
    const uniquePeers = Array.from(new Set(input.peersIds))
    input = { ...input, peersIds: uniquePeers }

    return await this.createOrFail(input)
  }

  private getOwnChatsFilter(userId: string) {
    const filter: ChatFilterQuery = { peersIds: { $all: [userId] } }
    return filter
  }
}
