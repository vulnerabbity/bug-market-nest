import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFile
} from "@nestjs/common"
import { Request } from "express"
import { CheckPolicies } from "src/auth/authorization/abilities/decorators/check-policies.decorator"
import { appConfig } from "src/common/config"
import { DefinedPipe } from "src/common/pipes/defined.pipe"
import { ParseRangePipe } from "src/common/pipes/range.pipe"
import { ImageUploadEndpoint } from "src/files/decorators/image-upload-endpoint.decorator"
import { MEGABYTE_IN_BYTES } from "src/files/files.constants"
import { MulterFile } from "src/files/multer/interface.multer"
import { PublicFileDto } from "src/files/public/dto/public-file.dto"
import { PublicFileResponse } from "src/files/public/public-files.interface"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import { ProductsService } from "./products.service"

const lastImageIndex = appConfig.products.imageLimit - 1
const parseImageIndexPipe = new ParseRangePipe({ end: lastImageIndex })

@Controller("products")
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private requestsParser: RequestsParserService
  ) {}

  @CheckPolicies()
  @Post("images/:productId/:imageIndex")
  @ImageUploadEndpoint("image", { limits: { fileSize: 5 * MEGABYTE_IN_BYTES } })
  public async uploadImageHandler(
    @UploadedFile(new DefinedPipe("image")) uploadedProductImage: MulterFile,
    @Param("productId") productId: string,
    @Param("imageIndex", parseImageIndexPipe) imageIndex: number,
    @Req() request: Request
  ): Promise<PublicFileResponse> {
    const requester = this.requestsParser.parseRolesOwnerOrFail(request)
    const product = await this.productsService.findByIdOrFail(productId)

    this.productsService.checkIfCanManageProduct(requester, product)

    const newImageUrl = this.productsService.generateImageUrl({ product, imageIndex })

    const imageFileDto: PublicFileDto = {
      data: uploadedProductImage.buffer,
      mimetype: uploadedProductImage.mimetype,
      url: newImageUrl,
      userId: requester.id
    }

    await this.productsService.uploadImageFileAndAddUrlToProduct(imageFileDto, product)

    return { success: true, message: "Product image uploaded", fileUrl: newImageUrl }
  }

  @CheckPolicies()
  @Delete("images/:productId/:imageUrl")
  public async deleteImageHandler(
    @Param("productId") productId: string,
    @Param("imageUrl") imageUrlToDelete: string,
    @Req() request: Request
  ): Promise<PublicFileResponse> {
    const requester = this.requestsParser.parseRolesOwnerOrFail(request)
    const product = await this.productsService.findByIdOrFail(productId)

    this.productsService.checkIfCanManageProduct(requester, product)

    const productHasRequestedUrl = product.imagesUrls.includes(imageUrlToDelete)

    if (productHasRequestedUrl === false) {
      const message = `Product dont have image url '${imageUrlToDelete}'`
      throw new BadRequestException(message)
    }

    await this.productsService.deleteImageFileAndUrlFromProduct(imageUrlToDelete, product)
    return { success: true, message: "Product image deleted", fileUrl: imageUrlToDelete }
  }
}
