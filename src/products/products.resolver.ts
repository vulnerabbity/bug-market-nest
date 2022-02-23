import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
import { Request } from "express"
import { AccessTokenPayload, TokenPayload } from "src/auth/authentication/authentication.interface"
import { JwtGqlAuthenticationGuard } from "src/auth/authentication/guards/jwt-gql-authentication.guard"
import { GraphqlRequest } from "src/common/decorators/graphql/request.decorator"
import { User } from "src/users/user.entity"
import { UsersService } from "src/users/users.service"
import { GetProductsArgs } from "./dto/args/get-products.args"
import { CreateProductArgs, CreateProductInput } from "./dto/input/create-product.input"
import { Product } from "./product.entity"
import { ProductsService } from "./products.service"

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService, private usersService: UsersService) {}
  @Query(() => [Product], { name: "products" })
  public async getManyPaginated(@Args() getProductsArgs: GetProductsArgs) {
    return await this.productsService.findManyPaginated(
      {},
      { limit: getProductsArgs.limit, offset: getProductsArgs.offset }
    )
  }

  @UseGuards(JwtGqlAuthenticationGuard)
  @Mutation(() => Product, { name: "createProduct" })
  public async create(
    @CreateProductArgs() createProductData: CreateProductInput,
    @GraphqlRequest() req: Request
  ) {
    const tokenPayload = req.user as TokenPayload
    const userId = tokenPayload.sub

    createProductData.userId = userId
    return this.productsService.createOrFail(createProductData)
  }

  @ResolveField("totalCount", () => Number)
  async resolveProductsCount(): Promise<number> {
    return await this.productsService.getEstimatedCount()
  }

  @ResolveField("author", () => User)
  async resolveAuthor(@Parent() product: Product): Promise<User> {
    return await this.usersService.findByIdOrFail(product.userId)
  }
}
