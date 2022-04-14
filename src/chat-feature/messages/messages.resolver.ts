import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { Request } from "express"
import { CheckPolicies } from "src/auth/authorization/abilities/decorators/check-policies.decorator"
import { GraphqlRequest } from "src/common/decorators/graphql/request.decorator"
import { Pagination } from "src/common/objects/pagination.input"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import { ChatsService } from "../chats/chats.service"
import { ChatMessage, PaginatedChatMessages } from "./message.entity"
import { SendChatMessageInput } from "./message.input"
import { ChatMessagesService } from "./messages.service"

@Resolver(() => ChatMessage)
export class ChatMessagesResolver {
  constructor(
    private messagesService: ChatMessagesService,
    private chatsService: ChatsService,
    private requestsParser: RequestsParserService
  ) {}

  @CheckPolicies()
  @Query(() => PaginatedChatMessages, { name: "messages" })
  async getMessages(
    @GraphqlRequest() req: Request,
    @Args("chatId") chatId: string,
    @Args("pagination", { nullable: true }) pagination?: Pagination
  ): Promise<PaginatedChatMessages> {
    const requesterId = this.requestsParser.parseUserIdOrFail(req)

    const chat = await this.chatsService.findByIdOrFail(chatId)
    this.chatsService.failIfViewMessageDenied({ chat, requesterId })

    const messages = await this.messagesService.findLastMessagesPaginated(chat.id, pagination)

    return messages
  }

  @CheckPolicies()
  @Query(() => ChatMessage, { name: "lastMessage", nullable: true })
  async getLastMessage(
    @GraphqlRequest() req: Request,
    @Args("chatId") chatId: string
  ): Promise<ChatMessage | null> {
    const requesterId = this.requestsParser.parseUserIdOrFail(req)

    const chat = await this.chatsService.findByIdOrFail(chatId)
    this.chatsService.failIfViewMessageDenied({ chat, requesterId })

    const lastMessage = await this.messagesService.findLastMessageOrNull(chat.id)
    return lastMessage
  }

  @CheckPolicies()
  @Mutation(() => ChatMessage, { name: "sendMessage" })
  async sendMessage(
    @Args("SendMessageInput") input: SendChatMessageInput,
    @GraphqlRequest() req: Request
  ): Promise<ChatMessage> {
    const { text, userId: receiverId } = input

    const senderId = this.requestsParser.parseUserIdOrFail(req)
    return await this.messagesService.sendMessage({ receiverId, senderId, text })
  }
}
