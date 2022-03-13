import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { CheckPolicies } from "src/auth/authorization/abilities/decorators/check-policies.decorator"
import { CategoriesService } from "./categories.service"
import { Category } from "./category.entity"
import { CreateCategoryInput } from "./dto/category.input"

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private categoriesService: CategoriesService) {}

  @Query(() => [Category], { name: "categories" })
  public async getMany(): Promise<Category[]> {
    const { data: categories } = await this.categoriesService.findMany()
    return categories
  }

  @CheckPolicies(ability => ability.can("create", Category))
  @Mutation(() => Category, { name: "createCategory" })
  public async createCategory(
    @Args("createCategoryInput") createCategoryData: CreateCategoryInput
  ): Promise<Category> {
    return await this.categoriesService.createOrFail(createCategoryData)
  }
}
