import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
import { PaginationArgs } from "src/common/args/pagination.args"
import { Iso3166CountryCode } from "src/locations/interfaces/iso-3166.interface"
import { LocationsService } from "src/locations/locations.service"
import { Product } from "src/products/product.entity"
import { ProductsService } from "src/products/products.service"
import { CreateUserArgs, CreateUserInput } from "./dto/input/create-user.input"
import { User } from "./user.entity"
import { UsersService } from "./users.service"

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private productsService: ProductsService,
    private locationsService: LocationsService
  ) {}

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
  public async createSeller(@CreateUserArgs() createSellerInput: CreateUserInput): Promise<User> {
    const createSellerDto: Partial<User> = { ...createSellerInput }
    createSellerDto.roles = ["seller"]
    if (createSellerDto.cityId) {
      const { countryCode } = await this.locationsService.findCityOrFail({
        id: createSellerDto.cityId
      })
      createSellerDto.countryCode = countryCode as Iso3166CountryCode
    }
    return await this.usersService.createOrFail(createSellerDto)
  }

  @ResolveField("products", () => [Product])
  public async resolveProducts(@Parent() user: User): Promise<Product[]> {
    return await this.productsService.findMany({ userId: user.id })
  }
}
