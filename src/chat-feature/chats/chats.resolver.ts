import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { Request } from "express"
import { CheckPolicies } from "src/auth/authorization/abilities/decorators/check-policies.decorator"
import { GraphqlRequest } from "src/common/decorators/graphql/request.decorator"
import { Pagination } from "src/common/objects/pagination.input"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import { Chat, PaginatedChats } from "./chat.entity"
import { ChatsService } from "./chats.service"

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(private chatsService: ChatsService, private requestsParser: RequestsParserService) {}

  @CheckPolicies()
  @Query(() => PaginatedChats, { name: "chats" })
  async getChats(
    @GraphqlRequest() req: Request,
    @Args("pagination", { nullable: true }) pagination?: Pagination
  ): Promise<PaginatedChats> {
    const requester = this.requestsParser.parseUserIdOrFail(req)

    return await this.chatsService.getChatsPaginated(requester, pagination)
  }

  @CheckPolicies()
  @Query(() => Chat, { name: "chat" })
  async getConcreteChat(
    @GraphqlRequest() req: Request,
    @Args("chatId") chatId: string
  ): Promise<Chat> {
    const requesterId = this.requestsParser.parseUserIdOrFail(req)

    const chat = await this.chatsService.findByIdOrFail(chatId)

    this.chatsService.failIfManageChatDenied({ chat, requesterId })

    return chat
  }

  @CheckPolicies()
  @Mutation(() => Chat, { name: "initChatIfNotExists" })
  async initChat(@GraphqlRequest() req: Request, @Args("otherUserId") otherUserId: string) {
    const requesterId = this.requestsParser.parseUserIdOrFail(req)

    const peersIds = [requesterId, otherUserId]

    const chat = await this.chatsService.initIfNotExistsAndNotifyOrFail({ peersIds })

    return chat
  }

  @CheckPolicies()
  @Mutation(() => Chat, { name: "deleteChat" })
  async deleteChat(@GraphqlRequest() req: Request, @Args("chatId") chatId: string) {
    const requesterId = this.requestsParser.parseUserIdOrFail(req)

    const chat = await this.chatsService.findByIdOrFail(chatId)

    this.chatsService.failIfManageChatDenied({ chat, requesterId })

    this.chatsService.deleteChatAndNotifyOrFail(chatId)

    return chat
  }
}
