import { Injectable } from "@nestjs/common"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"
import { MongooseService } from "src/common/service/mongoose.service"
import { ChatsService } from "../chats/chats.service"
import { ChatMessage, ChatMessageFilterQuery, PaginatedChatMessages } from "./message.entity"
import { UsersService } from "src/users/users.service"
import { Pagination } from "src/common/objects/pagination.input"
import { ChatNotificationsGateway } from "../notifications/notifications.gateway"
import { ChatMessagesEventsBus } from "./messages.events-bus"

export interface CreateChatMessageInput {
  chatId: string
  userId: string
  text: string
}

interface ViewMessagesInput {
  chatId: string
  viewerId: string
}

@Injectable()
export class ChatMessagesService extends MongooseService<ChatMessage> {
  // no need to get accurate number. Client will use 99+
  private notViewedMessagesLimit = 100

  constructor(
    modelsInjector: ModelsInjectorService,
    private chatsService: ChatsService,
    private usersService: UsersService,
    private messagesEventsBus: ChatMessagesEventsBus
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

  async sendMessage(input: CreateChatMessageInput): Promise<ChatMessage> {
    const { text, userId: senderId, chatId } = input

    const chat = await this.chatsService.findByIdOrFail(chatId)
    await this.usersService.failIfIdNotExists(senderId)

    const sendedMessage = await this.createMessageOrFail({ chatId, text, userId: senderId })

    await this.chatsService.updateUpdatedAtOrFail(chatId)
    this.messagesEventsBus.messageSended$.next({ message: sendedMessage, chat })

    return sendedMessage
  }

  async viewMessages(chatId: string, viewerId: string) {
    const filter = this.makeNotViewedPerChatFilter({ chatId, viewerId })
    const addViewerId = {
      $push: { viewedBy: viewerId }
    }
    const chat = await this.chatsService.findByIdOrFail(chatId)

    const updatedMessages = await this.updateMany(filter, addViewerId)
    if (updatedMessages.length > 0) {
      this.messagesEventsBus.messagesUpdated$.next({ messages: updatedMessages, chatId })
      this.messagesEventsBus.notViewedChanged$.next(chat)
    }
  }

  async getNotViewedNumberPerChat(input: ViewMessagesInput) {
    const filter = this.makeNotViewedPerChatFilter(input)

    const limit = this.notViewedMessagesLimit

    const notViewedNumber = await this.getTotalCount(filter, { limit })
    return notViewedNumber
  }

  async getTotalNotViewedNumber(viewerId: string) {
    const chatIds = await this.chatsService.getChatIds(viewerId)
    // all messages in viewer's chats that not viewed by him
    const filter: ChatMessageFilterQuery = {
      chatId: { $in: chatIds },
      viewedBy: { $nin: viewerId }
    }

    return await this.getTotalCount(filter, { limit: this.notViewedMessagesLimit })
  }

  private makeNotViewedPerChatFilter(input: ViewMessagesInput): ChatMessageFilterQuery {
    const { chatId, viewerId } = input
    return { chatId, viewedBy: { $nin: viewerId } }
  }

  private async createMessageOrFail(input: CreateChatMessageInput): Promise<ChatMessage> {
    return await this.createOrFail(input)
  }
}
