import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { Request } from "express"
import { CheckPolicies } from "src/auth/authorization/abilities/decorators/check-policies.decorator"
import { PaginationArgs } from "src/common/args/pagination.args"
import { GraphqlRequest } from "src/common/decorators/graphql/request.decorator"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import { PaginatedProducts, Product, ProductSorting } from "./product.entity"
import { ProductsService } from "./products.service"
import { CreateProductInput, UpdateProductInput } from "./dto/input/product.input"

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private productsService: ProductsService,
    private requestsParser: RequestsParserService
  ) {}

  @Query(() => PaginatedProducts, { name: "products" })
  public async searchManyPaginated(
    @Args({ nullable: true, name: "search" }) search?: string,
    @Args({ nullable: true }) pagination?: PaginationArgs,
    @Args({ nullable: true, name: "sorting" }) sorting?: ProductSorting
  ) {
    if (!search) {
      return await this.productsService.findMany({ pagination, sorting })
    }
    return await this.productsService.fuzzySearchPaginated(search, { pagination, sorting })
  }

  @CheckPolicies(ability => ability.can("create", Product))
  @Mutation(() => Product, { name: "createProduct" })
  public async create(
    @Args("createProductInput") createProductData: CreateProductInput,
    @GraphqlRequest() req: Request
  ) {
    const userId = this.requestsParser.parseUserIdOrFail(req)
    await this.productsService.failIfCategoryIdNotExists(createProductData.categoryId)

    createProductData.userId = userId
    return await this.productsService.createOrFail(createProductData)
  }

  @CheckPolicies()
  @Mutation(() => Product, { name: "updateProduct" })
  public async update(
    @Args("id") productId: string,
    @Args("updateProductInput") updateProductData: UpdateProductInput,
    @GraphqlRequest() req: Request
  ): Promise<Product> {
    const requester = this.requestsParser.parseRolesOwnerOrFail(req)
    const product = await this.productsService.findByIdOrFail(productId)
    this.productsService.failIfUpdatingForbidden({ requester, subject: product })

    const categoryId = updateProductData.categoryId
    const needUpdateCategory = categoryId !== undefined
    if (needUpdateCategory) {
      await this.productsService.failIfCategoryIdNotExists(categoryId)
    }

    const updatedProduct = await this.productsService.updateByIdOrFail(productId, updateProductData)
    return updatedProduct
  }

  @CheckPolicies()
  @Mutation(() => Product, { name: "deleteProduct" })
  public async delete(
    @Args("id") productId: string,
    @GraphqlRequest() req: Request
  ): Promise<Product> {
    const requester = this.requestsParser.parseRolesOwnerOrFail(req)
    const product = await this.productsService.findByIdOrFail(productId)
    this.productsService.failIfDeletingForbidden({ requester, subject: product })

    await this.productsService.deleteProductAndAllImagesById(productId)
    return product
  }
}
