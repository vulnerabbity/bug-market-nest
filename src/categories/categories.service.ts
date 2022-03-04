import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { MongooseService } from "src/common/service/mongoose.service"
import { Category, CategoryModel } from "./category.entity"

@Injectable()
export class CategoriesService extends MongooseService<Category> {
  constructor(@InjectModel(Category.name) private categoryModel: CategoryModel) {
    super(categoryModel)
  }
}
