import { Mutation, Query, Resolver } from "@nestjs/graphql"
import { CreateUserArgs, CreateUserInput } from "./dto/input/create-user.input"
import { User } from "./user.entity"
import { UsersService } from "./users.service"

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => String)
  healthCheck() {
    return "alive"
  }

  @Mutation(() => User)
  async createSeller(@CreateUserArgs() createSellerData: CreateUserInput): Promise<User> {
    createSellerData.roles = ["seller"]
    return await this.usersService.createOrFail(createSellerData)
  }
}
