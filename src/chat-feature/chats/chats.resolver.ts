import { Args, Query, Resolver } from "@nestjs/graphql"
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
}
