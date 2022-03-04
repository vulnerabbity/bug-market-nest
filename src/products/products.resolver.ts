import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { Request } from "express"
import { CheckPolicies } from "src/auth/authorization/abilities/decorators/check-policies.decorator"
import { CategoriesService } from "src/categories/categories.service"
import { PaginationArgs } from "src/common/args/pagination.args"
import { GraphqlRequest } from "src/common/decorators/graphql/request.decorator"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import { Product } from "./product.entity"
import { ProductsService } from "./products.service"
import { Category, CategoryModel } from "src/categories/category.entity"
import { InjectModel } from "@nestjs/mongoose"
import { CreateProductInput, UpdateProductInput } from "./dto/input/product.input"
import { RolesOwner } from "src/auth/authorization/abilities/abilities.interface"
import { CaslAbilityFactory } from "src/auth/authorization/abilities/casl-ability.factory"
import { InvalidPermissionsException } from "src/common/exceptions/authorization.exception"

@Resolver(() => Product)
export class ProductsResolver {
  private categoriesService = new CategoriesService(this.categoryModel)

  constructor(
    private productsService: ProductsService,
    private requestsParser: RequestsParserService,
    @InjectModel(Category.name)
    private categoryModel: CategoryModel,
    private abilityFactory: CaslAbilityFactory
  ) {}

  @Query(() => [Product], { name: "products" })
  public async getManyPaginated(@Args() pagination: PaginationArgs) {
    const withoutFilter = {}
    return await this.productsService.findManyPaginated(withoutFilter, pagination)
  }

  @Query(() => [Product], { name: "searchProducts" })
  public async searchManyPaginated(
    @Args("searchQuery") search: string,
    @Args() pagination: PaginationArgs
  ) {
    return await this.productsService.fuzzySearchPaginated(search, pagination)
  }

  @CheckPolicies(ability => ability.can("create", Product))
  @Mutation(() => Product, { name: "createProduct" })
  public async create(
    @Args("createProductInput") createProductData: CreateProductInput,
    @GraphqlRequest() req: Request
  ) {
    const userId = this.requestsParser.parseUserIdOrFail(req)
    await this.failIfCategoryIdNotExists(createProductData.categoryId)

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
    this.checkIfCanManageProduct(requester, product)

    const categoryId = updateProductData.categoryId
    const needUpdateCategory = categoryId !== undefined
    if (needUpdateCategory) {
      await this.failIfCategoryIdNotExists(categoryId)
    }

    return await this.productsService.updateByIdOrFail(productId, updateProductData)
  }

  private checkIfCanManageProduct(requester: RolesOwner, product: Product) {
    product = this.productsService.convertToCaslCompatible(product)

    const requesterAbilities = this.abilityFactory.createForRolesOwner(requester)
    const canUpdate = requesterAbilities.can("manage", product)

    if (canUpdate === false) {
      throw new InvalidPermissionsException()
    }
  }

  private async failIfCategoryIdNotExists(categoryId: string) {
    await this.categoriesService.failIfIdNotExists(categoryId)
  }
}
