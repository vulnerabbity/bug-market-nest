import { Inject } from "@nestjs/common"
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
import { CheckPolicies } from "src/auth/authorization/abilities/decorators/check-policies.decorator"
import { PaginationArgs } from "src/common/args/pagination.args"
import { PaginatedProducts, Product } from "src/products/product.entity"
import { ProductsService } from "src/products/products.service"
import { CategoriesService } from "./categories.service"
import { Category } from "./category.entity"
import { CreateCategoryInput } from "./dto/category.input"

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService
  ) {}

  @Query(() => [Category], { name: "categories" })
  public async getMany(): Promise<Category[]> {
    const categories = await this.categoriesService.findAll()
    return categories
  }

  @CheckPolicies(ability => ability.can("create", Category))
  @Mutation(() => Category, { name: "createCategory" })
  public async createCategory(
    @Args("createCategoryInput") createCategoryData: CreateCategoryInput
  ): Promise<Category> {
    return await this.categoriesService.createOrFail(createCategoryData)
  }

  @ResolveField("products", () => [Product])
  public async resolveProducts(
    @Parent() currentCategory: Category,
    @Args() pagination: PaginationArgs
  ): Promise<PaginatedProducts> {
    return await this.productsService.findManyPaginated(
      { categoryId: currentCategory.id },
      pagination
    )
  }
}
