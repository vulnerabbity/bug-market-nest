import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { PublicFile, publicFileModel, PublicFileModel } from "src/files/public/public-file.entity"
import { Product, ProductFuzzyModel, productModel } from "src/products/product.entity"
import { Session, sessionModel, SessionModel } from "src/sessions/session.entity"
import { User, userModel, UserModel } from "src/users/user.entity"

/**
 * Allows avoid complex model injection syntax.
 * Very useful if service uses two+ models,
 * where by default constructor became bloated
 */
@Injectable()
export class ModelsInjectorService {
  @InjectModel(User.name)
  public userModel: UserModel = userModel

  @InjectModel(Session.name)
  public sessionModel: SessionModel = sessionModel

  @InjectModel(Product.name)
  public productModel: ProductFuzzyModel = productModel

  @InjectModel(PublicFile.name)
  public publicFileModel: PublicFileModel = publicFileModel
}
