import { Injectable } from "@nestjs/common"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"
import { MongooseService } from "src/common/service/mongoose.service"
import { ChatsService } from "../chats/chats.service"
import { ChatMessage, ChatMessageFilterQuery, PaginatedChatMessages } from "./message.entity"
import { UsersService } from "src/users/users.service"
import { Pagination } from "src/common/objects/pagination.input"

export interface BasicPeers {
  senderId: string
  receiverId: string
}

interface SendChatMessageInput extends BasicPeers {
  text: string
}

export interface CreateChatMessageInput {
  chatId: string
  userId: string
  text: string
}

@Injectable()
export class ChatMessagesService extends MongooseService<ChatMessage> {
  constructor(
    modelsInjector: ModelsInjectorService,
    private chatsService: ChatsService,
    private usersService: UsersService
  ) {
    super(modelsInjector.chatMessageModel)
  }

  async findLastMessageOrNull(chatId: string): Promise<ChatMessage | null> {
    const takeOnePagination: Pagination = { offset: 0, limit: 1 }
    const { data: messages } = await this.findLastMessagesPaginated(chatId, takeOnePagination)
    const lastMessage = messages[0]
    if (lastMessage) {
      return lastMessage
    }

    return null
  }

  async findLastMessagesPaginated(
    chatId: string,
    pagination?: Pagination
  ): Promise<PaginatedChatMessages> {
    const filterByChatId: ChatMessageFilterQuery = { chatId }
    const lastFirst = { createdAt: "desc" }

    return await this.findManyPaginated({ filter: filterByChatId, pagination, sorting: lastFirst })
  }

  async sendMessage(input: SendChatMessageInput): Promise<ChatMessage> {
    const { text, senderId, receiverId } = input

    await this.usersService.failIfIdNotExists(receiverId)

    const { id: chatId } = await this.createChatIfNotExists(input)
    const sendedMessage = await this.createMessageOrFail({ chatId, text, userId: senderId })

    await this.chatsService.updateUpdatedAtOrFail(chatId)

    return sendedMessage
  }

  private async createMessageOrFail(input: CreateChatMessageInput): Promise<ChatMessage> {
    return await this.createOrFail(input)
  }

  private async createChatIfNotExists(input: SendChatMessageInput) {
    const { receiverId, senderId } = input
    const peersIds = [receiverId, senderId]

    const chat = await this.chatsService.createIfNotExists({ peersIds })
    return chat
  }
}
