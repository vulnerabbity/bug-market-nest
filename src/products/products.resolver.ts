import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { Request } from "express"
import { CheckPolicies } from "src/auth/authorization/abilities/decorators/check-policies.decorator"
import { Pagination } from "src/common/objects/pagination.input"
import { GraphqlRequest } from "src/common/decorators/graphql/request.decorator"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import {
  PaginatedProducts,
  Product,
  ProductFilters,
  ProductSorting,
  ProductFilterQuery
} from "./product.entity"
import { ProductsService } from "./products.service"
import { CreateProductInput, UpdateProductInput } from "./dto/input/product.input"
import { MongooseFilteredSearchingQuery } from "src/common/interface/mongoose.interface"

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private productsService: ProductsService,
    private requestsParser: RequestsParserService
  ) {}

  @Query(() => Product, { name: "product" })
  public async getSingleProduct(@Args("id") id: string) {
    return await this.productsService.findByIdOrFail(id)
  }

  @Query(() => PaginatedProducts, { name: "products" })
  public async searchManyPaginated(
    @Args({ nullable: true, name: "filtering" }) filtering?: ProductFilters,
    @Args({ nullable: true, name: "fuzzySearch" }) fuzzySearch?: string,
    @Args({ nullable: true, name: "pagination" }) pagination?: Pagination,
    @Args({ nullable: true, name: "sorting" }) sorting?: ProductSorting
  ) {
    // TODO: refactoring
    let filter: ProductFilterQuery = {}
    if (filtering) {
      const { priceRange } = filtering
      filter = {
        price: { $gte: priceRange?.min, $lte: priceRange?.max }
      }
    }

    const searchQuery: MongooseFilteredSearchingQuery<Product> = {
      pagination,
      sorting,
      filter
    }

    return await this.productsService.findManyPaginated(searchQuery, fuzzySearch)
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
