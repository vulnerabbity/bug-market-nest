import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
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
import { CategoriesService } from "src/categories/categories.service"
import { BadRequestException } from "@nestjs/common"
import { PublicFilesService } from "src/files/public/public-files.service"

@Resolver(() => Product)
export class ProductsResolver {
  private categoriesService = new CategoriesService()

  constructor(
    private productsService: ProductsService,
    private requestsParser: RequestsParserService,
    private publicFilesService: PublicFilesService
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
    // TODO: refactoring x2
    let filter: ProductFilterQuery = {}
    if (filtering?.priceRange) {
      filter.price = { $gte: filtering.priceRange.min, $lte: filtering.priceRange.max }
    }
    if (filtering?.categoryName) {
      filter.categoryName = filtering.categoryName
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
    this.failIfCategoryNotExists(createProductData.categoryName)

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

    const categoryName = updateProductData.categoryName
    const needUpdateCategory = categoryName !== undefined
    if (needUpdateCategory) {
      this.failIfCategoryNotExists(categoryName)
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

  @ResolveField(() => [String], { name: "imagesUrls" })
  public async resolveImageUrls(@Parent() product: Product) {
    return product.imagesIds.map(
      async imageId => await this.publicFilesService.createUrlForFileId(imageId)
    )
  }

  private failIfCategoryNotExists(categoryName: string): void {
    const isCategoryExist = this.categoriesService.isCategoryExists(categoryName)
    if (isCategoryExist) {
      return
    }
    throw new BadRequestException("Category does not exists")
  }
}
