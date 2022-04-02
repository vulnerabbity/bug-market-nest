import { Injectable } from "@nestjs/common"
import { MongooseFilteredSearchingQuery } from "src/common/interface/mongoose.interface"
import { IPaginatedEntities } from "src/common/interface/paginated-entity.interface"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"
import { MongooseCaslService } from "src/common/service/mongoose-casl.service"
import { PublicFileDto } from "src/files/public/dto/public-file.dto"
import { PublicFilesService } from "src/files/public/public-files.service"
import { Product, ProductFilterQuery } from "./product.entity"

@Injectable()
export class ProductsService extends MongooseCaslService<Product> {
  documentModel = this.modelsInjector.productModel

  constructor(
    private publicFilesService: PublicFilesService,
    private modelsInjector: ModelsInjectorService
  ) {
    super(modelsInjector.productModel)
  }

  public async findMany(query: MongooseFilteredSearchingQuery<Product> = {}, search: string = "") {
    if (search === "") {
      return await super.findMany(query)
    }
    // adds fuzzy search middleware to default query
    return await this.documentModel.fuzzySearch(search).where(super.makeFindManyQuery(query))
  }

  public async findManyPaginated(
    query: MongooseFilteredSearchingQuery<Product> = {},
    search = ""
  ): Promise<IPaginatedEntities<Product>> {
    if (search === "") {
      return await super.findManyPaginated(query)
    }
    const products = await this.findMany(query, search)
    const totalResultsCount = await this.documentModel.fuzzySearch(search).count()
    return { data: products, totalResultsCount }
  }

  public async uploadImageFileAndAddIdToProduct(dto: PublicFileDto, product: Product) {
    await this.addImageId(dto.id, product)
    await this.publicFilesService.upload(dto)
  }

  public async deleteImage(imageId: string, product: Product) {
    await this.deleteImageId(imageId, product)
    await this.publicFilesService.deleteByIdOrFail(imageId)
  }

  public async deleteProductAndAllImagesById(id: string): Promise<void> {
    await this.deleteProductAndAllImages({ id })
  }

  public async deleteProductAndAllImages(filter: ProductFilterQuery): Promise<void> {
    const { imagesIds } = await this.findOneOrFail(filter)
    await this.deleteOneOrFail(filter)
    imagesIds.forEach(async imageId => {
      await this.publicFilesService.deleteByIdOrFail(imageId)
    })
  }

  private async addImageId(newId: string, product: Product): Promise<Product> {
    const alreadyHasNewUrl = product.imagesIds.includes(newId)
    if (alreadyHasNewUrl) {
      return product
    }

    const newUrls = [...product.imagesIds, newId]
    return await this.updateImagesIds(newUrls, product)
  }

  private async deleteImageId(imageIdToDelete: string, product: Product): Promise<Product> {
    const needDeleteImage = product.imagesIds.includes(imageIdToDelete)
    if (needDeleteImage === false) {
      return product
    }

    const newIds = product.imagesIds.filter(imageId => imageId !== imageIdToDelete)
    return await this.updateImagesIds(newIds, product)
  }

  private async updateImagesIds(newIds: string[], { id: productId }: Product): Promise<Product> {
    return await this.updateByIdOrFail(productId, { imagesIds: newIds })
  }
}
