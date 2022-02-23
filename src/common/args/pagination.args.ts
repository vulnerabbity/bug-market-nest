import { ArgsType, Field } from "@nestjs/graphql"

@ArgsType()
export class PaginationArgs {
  @Field()
  offset: number = 0

  @Field()
  limit: number = 10
}
