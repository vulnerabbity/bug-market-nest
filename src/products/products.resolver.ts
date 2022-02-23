import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
import { Request } from "express"
import { TokenPayload } from "src/auth/authentication/authentication.interface"
import { JwtGqlAuthenticationGuard } from "src/auth/authentication/guards/jwt-gql-authentication.guard"
import { PaginationArgs } from "src/common/args/pagination.args"
import { GraphqlRequest } from "src/common/decorators/graphql/request.decorator"
import { CreateProductArgs, CreateProductInput } from "./dto/input/create-product.input"
import { Product } from "./product.entity"
import { ProductsService } from "./products.service"

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}
  @Query(() => [Product], { name: "products" })
  public async getManyPaginated(@Args() pagination: PaginationArgs) {
    const filterQuery = {}
    return await this.productsService.findManyPaginated(filterQuery, pagination)
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
}
