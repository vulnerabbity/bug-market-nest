import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
import { PaginationArgs } from "src/common/args/pagination.args"
import { Product } from "src/products/product.entity"
import { ProductsService } from "src/products/products.service"
import { CreateUserArgs, CreateUserInput } from "./dto/input/create-user.input"
import { User } from "./user.entity"
import { UsersService } from "./users.service"

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService, private productsService: ProductsService) {}

  @Query(() => [User], { name: "users" })
  public async getMany(@Args() pagination: PaginationArgs): Promise<User[]> {
    const filterQuery = {}
    return await this.usersService.findManyPaginated(filterQuery, pagination)
  }

  @Query(() => User, { name: "user" })
  public async getById(@Args("userId") userId: string) {
    return this.usersService.findByIdOrFail(userId)
  }

  @Mutation(() => User)
  public async createSeller(@CreateUserArgs() createSellerData: CreateUserInput): Promise<User> {
    createSellerData.roles = ["seller"]
    return await this.usersService.createOrFail(createSellerData)
  }

  @ResolveField("products", () => [Product])
  public async resolveProducts(@Parent() user: User) {
    return await this.productsService.findMany({ userId: user.id })
  }
}
