import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { MongooseFuzzyModel } from "mongoose-fuzzy-search"
import { MongooseService, PaginationSettings } from "src/common/service/mongoose.service"
import { Product, ProductDocument, ProductModel } from "./product.entity"

export type ProductFuzzyModel = ProductModel & MongooseFuzzyModel<ProductDocument>

@Injectable()
export class ProductsService extends MongooseService<Product> {
  constructor(
    @InjectModel(Product.name)
    private productModel: ProductFuzzyModel
  ) {
    super(productModel)
  }

  public async fuzzySearchPaginated(
    search: string,
    { limit, offset }: PaginationSettings
  ): Promise<Product[]> {
    const products = await this.productModel.fuzzySearch(search).skip(offset).limit(limit)

    return products
  }

  public convertToCaslCompatible(databaseRetrievedProduct: Product) {
    const caslProduct = new Product()
    Object.assign(caslProduct, databaseRetrievedProduct)
    caslProduct.userId = databaseRetrievedProduct.userId
    return caslProduct
  }
}
