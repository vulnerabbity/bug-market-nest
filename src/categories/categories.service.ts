import { Injectable } from "@nestjs/common"
import { CategoriesList, Category } from "./categories.list"

@Injectable()
export class CategoriesService {
  private readonly categories = CategoriesList

  getCategories(): Category[] {
    const categories = this.categories as unknown as Category[]
    return categories
  }

  isCategoryExists(name: string): boolean {
    return this.categories.includes(name as any)
  }
}
