import {
  BadRequestException,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UploadedFile
} from "@nestjs/common"
import { Request } from "express"
import { CheckPolicies } from "src/auth/authorization/abilities/decorators/check-policies.decorator"
import { appConfig } from "src/common/config"
import { DefinedPipe } from "src/common/pipes/defined.pipe"
import { ImageUploadEndpoint } from "src/files/decorators/image-upload-endpoint.decorator"
import { MEGABYTE_IN_BYTES } from "src/files/files.constants"
import { MulterFile } from "src/files/multer/interface.multer"
import { PublicFileDto } from "src/files/public/dto/public-file.dto"
import { PublicFileResponse } from "src/files/public/public-files.interface"
import { PublicFilesService } from "src/files/public/public-files.service"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import { v4 } from "uuid"
import { Product } from "./product.entity"
import { ProductsService } from "./products.service"

@Controller("products")
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private requestsParser: RequestsParserService
  ) {}

  @CheckPolicies()
  @Post("images/:productId")
  @ImageUploadEndpoint("image", { limits: { fileSize: 10 * MEGABYTE_IN_BYTES } })
  public async createImageHandler(
    @UploadedFile(new DefinedPipe("image")) imageToCreate: MulterFile,
    @Param("productId") productId: string,
    @Req() request: Request
  ): Promise<PublicFileResponse> {
    const requester = this.requestsParser.parseRolesOwnerOrFail(request)
    const product = await this.productsService.findByIdOrFail(productId)

    this.failIfImageNumberLimitReached(product)

    this.productsService.failIfUpdatingForbidden({ requester, subject: product })

    const imageId = v4() // TODO: Get from service

    const imageFileDto: PublicFileDto = {
      data: imageToCreate.buffer,
      mimetype: imageToCreate.mimetype,
      id: imageId,
      userId: requester.id
    }

    await this.productsService.uploadImageFileAndAddIdToProduct(imageFileDto, product)

    return { success: true, message: "Product image uploaded", imageId: imageId }
  }

  @CheckPolicies()
  @Put("images/:productId/:imageId")
  @ImageUploadEndpoint("image", { limits: { fileSize: 10 * MEGABYTE_IN_BYTES } })
  public async updateImageHandler(
    @UploadedFile(new DefinedPipe("image")) uploadedProductImage: MulterFile,
    @Param("productId") productId: string,
    @Param("imageId") imageId: string,
    @Req() request: Request
  ): Promise<PublicFileResponse> {
    const requester = this.requestsParser.parseRolesOwnerOrFail(request)
    const product = await this.productsService.findByIdOrFail(productId)

    this.productsService.failIfUpdatingForbidden({ requester, subject: product })
    const productHasRequestedImage = product.imagesIds.includes(imageId)
    if (productHasRequestedImage === false) {
      throw new NotFoundException(`Product dont have image with id ${imageId}`)
    }

    const imageFileDto: PublicFileDto = {
      data: uploadedProductImage.buffer,
      mimetype: uploadedProductImage.mimetype,
      id: imageId,
      userId: requester.id
    }

    await this.productsService.uploadImageFileAndAddIdToProduct(imageFileDto, product)

    return { success: true, message: "Product image uploaded", imageId: imageId }
  }

  @CheckPolicies()
  @Delete("images/:productId/:imageId")
  public async deleteImageHandler(
    @Param("productId") productId: string,
    @Param("imageId") imageId: string,
    @Req() request: Request
  ): Promise<PublicFileResponse> {
    const requester = this.requestsParser.parseRolesOwnerOrFail(request)
    const product = await this.productsService.findByIdOrFail(productId)

    this.productsService.failIfDeletingForbidden({ requester, subject: product })

    const productHasRequestedUrl = product.imagesIds.includes(imageId)

    if (productHasRequestedUrl === false) {
      const message = `Product dont have image id '${imageId}'`
      throw new NotFoundException(message)
    }

    await this.productsService.deleteImage(imageId, product)
    return { success: true, message: "Product image deleted", imageId }
  }

  private failIfImageNumberLimitReached(product: Product) {
    const reachedLimit = product.imagesIds.length >= appConfig.products.imageLimit
    if (reachedLimit) {
      throw new BadRequestException(`Reached image number limit (${appConfig.products.imageLimit})`)
    }
  }
}
