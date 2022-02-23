import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { MongooseService } from "src/common/service/mongoose.service"
import { Product, ProductModel } from "./product.entity"

@Injectable()
export class ProductsService extends MongooseService<Product> {
  constructor(@InjectModel(Product.name) private productModel: ProductModel) {
    super(productModel)
  }
}
