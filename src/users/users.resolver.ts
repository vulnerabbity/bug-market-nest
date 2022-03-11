import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
import { Request } from "express"
import { CheckPolicies } from "src/auth/authorization/abilities/decorators/check-policies.decorator"
import { GraphqlRequest } from "src/common/decorators/graphql/request.decorator"
import { Iso3166CountryCode } from "src/locations/interfaces/iso-3166.interface"
import { LocationsService } from "src/locations/locations.service"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import { Product } from "src/products/product.entity"
import { ProductsService } from "src/products/products.service"
import { CreateUserInput, UpdateUserInput } from "./dto/input/user.input"
import { User } from "./user.entity"
import { UsersService } from "./users.service"

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private productsService: ProductsService,
    private locationsService: LocationsService,
    private requestsParser: RequestsParserService
  ) {}

  @Query(() => User, { name: "user" })
  public async getById(@Args("userId") userId: string) {
    return this.usersService.findByIdOrFail(userId)
  }

  @Mutation(() => User, { name: "createSeller" })
  public async createSeller(@Args("input") createSellerInput: CreateUserInput): Promise<User> {
    const sellerDto: Partial<User> = { ...createSellerInput }
    sellerDto.roles = ["seller"]
    await this.setLocation(sellerDto)
    return await this.usersService.createOrFail(sellerDto)
  }

  @CheckPolicies()
  @Mutation(() => User, { name: "updateUser" })
  public async updateUser(
    @Args("userId") userId: string,
    @Args("input") updateSellerInput: UpdateUserInput,
    @GraphqlRequest() request: Request
  ): Promise<User> {
    const requester = this.requestsParser.parseRolesOwnerOrFail(request)
    const requestedUser = await this.usersService.findByIdOrFail(userId)
    this.usersService.failIfUpdatingForbidden({ subject: requestedUser, requester })

    const userDto: Partial<User> = { ...updateSellerInput }
    await this.setLocation(userDto)
    return await this.usersService.updateByIdOrFail(userId, userDto)
  }

  @ResolveField("products", () => [Product])
  public async resolveProducts(@Parent() user: User): Promise<Product[]> {
    return await this.productsService.findMany({ userId: user.id })
  }

  private async setLocation(user: Partial<User>) {
    if (user.cityId) {
      const { countryCode } = await this.locationsService.findCityOrFail({
        id: user.cityId
      })
      user.countryCode = countryCode as Iso3166CountryCode
    }
  }
}
