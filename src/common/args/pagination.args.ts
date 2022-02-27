import { ArgsType, Field } from "@nestjs/graphql"
import { IsInt, Max, Min } from "class-validator"

@ArgsType()
export class PaginationArgs {
  @Field()
  @Min(0)
  offset: number = 0

  @IsInt()
  @Max(50)
  @Min(1)
  @Field()
  limit: number = 10
}
