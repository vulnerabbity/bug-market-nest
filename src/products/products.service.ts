import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { MongooseFuzzyModel } from "mongoose-fuzzy-search"
import { RolesOwner } from "src/auth/authorization/abilities/abilities.interface"
import { CaslAbilityFactory } from "src/auth/authorization/abilities/casl-ability.factory"
import { CategoriesService } from "src/categories/categories.service"
import { Category, CategoryModel } from "src/categories/category.entity"
import { InvalidPermissionsException } from "src/common/exceptions/authorization.exception"
import { MongooseService, PaginationSettings } from "src/common/service/mongoose.service"
import { PublicFileDto } from "src/files/public/dto/public-file.dto"
import { PublicFilesService } from "src/files/public/public-files.service"
import { Product, ProductDocument, ProductFilterQuery, ProductModel } from "./product.entity"

export type ProductFuzzyModel = ProductModel & MongooseFuzzyModel<ProductDocument>

@Injectable()
export class ProductsService extends MongooseService<Product> {
  private categoriesService = new CategoriesService(this.categoryModel)

  constructor(
    @InjectModel(Product.name)
    private productModel: ProductFuzzyModel,
    private publicFilesService: PublicFilesService,
    private abilityFactory: CaslAbilityFactory,
    @InjectModel(Category.name)
    private categoryModel: CategoryModel
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

  public async uploadImageFileAndAddUrlToProduct(dto: PublicFileDto, product: Product) {
    await this.addImageUrl(dto.url, product)
    await this.publicFilesService.upload(dto)
  }

  public async deleteImageFileAndUrlFromProduct(urlToDelete: string, product: Product) {
    await this.deleteImageUrl(urlToDelete, product)
    await this.publicFilesService.deleteByUrl(urlToDelete)
  }

  public async deleteProductAndAllImagesById(id: string): Promise<void> {
    await this.deleteProductAndAllImages({ _id: id })
  }

  public async deleteProductAndAllImages(filter: ProductFilterQuery): Promise<void> {
    const { imagesUrls } = await this.findOneOrFail(filter)
    await this.deleteOneOrFail(filter)
    imagesUrls.forEach(async url => {
      await this.publicFilesService.deleteByUrl(url)
    })
  }

  public generateImageUrl({ product, imageIndex }: { product: Product; imageIndex: number }) {
    const productId = product.id
    return `${productId}_${imageIndex}`
  }

  public checkIfCanManageProduct(requester: RolesOwner, product: Product) {
    product = this.convertToCaslCompatible(product)

    const requesterAbilities = this.abilityFactory.createForRolesOwner(requester)
    const canUpdate = requesterAbilities.can("manage", product)

    if (canUpdate === false) {
      throw new InvalidPermissionsException()
    }
  }

  public async failIfCategoryIdNotExists(categoryId: string) {
    await this.categoriesService.failIfIdNotExists(categoryId)
  }

  private async addImageUrl(newUrl: string, product: Product): Promise<Product> {
    const alreadyHasNewUrl = product.imagesUrls.includes(newUrl)
    if (alreadyHasNewUrl) {
      return product
    }

    const newUrls = [...product.imagesUrls, newUrl]
    return await this.updateImagesUrls(newUrls, product)
  }

  private async deleteImageUrl(urlToDelete: string, product: Product): Promise<Product> {
    const needDeleteImage = product.imagesUrls.includes(urlToDelete)
    if (needDeleteImage === false) {
      return product
    }

    const newUrls = product.imagesUrls.filter(url => url !== urlToDelete)
    return await this.updateImagesUrls(newUrls, product)
  }

  private async updateImagesUrls(newUrls: string[], { id: productId }: Product): Promise<Product> {
    const sortedNewUrls = [...newUrls].sort()
    return await this.updateByIdOrFail(productId, { imagesUrls: sortedNewUrls })
  }

  private convertToCaslCompatible(databaseRetrievedProduct: Product) {
    const caslProduct = new Product()
    Object.assign(caslProduct, databaseRetrievedProduct)
    caslProduct.userId = databaseRetrievedProduct.userId
    return caslProduct
  }
}
