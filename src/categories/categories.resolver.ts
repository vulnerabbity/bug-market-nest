import { Query, Resolver } from "@nestjs/graphql"
import { Categories } from "./categories.entity"
import { CategoriesService } from "./categories.service"

@Resolver(() => Categories)
export class CategoriesResolver {
  constructor(private categoriesService: CategoriesService) {}

  @Query(() => Categories, { name: "categories" })
  public getMany(): Categories {
    const categories = this.categoriesService.getCategories()
    return { data: categories }
  }
}
