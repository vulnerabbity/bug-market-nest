import { Injectable } from "@nestjs/common"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"

import { MongooseService } from "src/common/service/mongoose.service"
import { Category } from "./category.entity"

@Injectable()
export class CategoriesService extends MongooseService<Category> {
  constructor(private modelsInjector: ModelsInjectorService) {
    super(modelsInjector.categoryModel)
  }
}
