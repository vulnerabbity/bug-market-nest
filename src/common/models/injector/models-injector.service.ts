import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Category, CategoryModel } from "src/categories/category.entity"
import { PublicFile, PublicFileModel } from "src/files/public/public-file.entity"
import { Product } from "src/products/product.entity"
import { ProductFuzzyModel } from "src/products/products.service"
import { Session, SessionModel } from "src/sessions/session.entity"
import { User, UserModel } from "src/users/user.entity"

/**
 * Allows avoid complex model injection syntax.
 * Very useful if service uses two+ models,
 * where by default constructor became bloated
 */
@Injectable()
export class ModelsInjectorService {
  @InjectModel(User.name)
  public userModel!: UserModel

  @InjectModel(Session.name)
  public sessionModel!: SessionModel

  @InjectModel(Product.name)
  public productModel!: ProductFuzzyModel

  @InjectModel(Category.name)
  public categoryModel!: CategoryModel

  @InjectModel(PublicFile.name)
  public publicFileModel!: PublicFileModel
}
