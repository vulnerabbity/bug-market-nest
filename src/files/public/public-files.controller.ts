import { Controller, Get, Param, Post, Req, Res, UploadedFiles, UseGuards } from "@nestjs/common"
import { Request, Response } from "express"
import { JwtAuthenticationGuard } from "src/auth/authentication/guards/jwt-authentication.guard"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import { ImagesUploadEndpoint } from "../decorators/image-upload-endpoint.decorator"
import { MEGABYTE_IN_BYTES } from "../files.constants"
import { MulterFile } from "../multer/interface.multer"
import { PublicFile, PublicFileType } from "./public-file.entity"
import { PublicFilesService } from "./public-files.service"

@Controller("public-files")
export class PublicFilesController {
  constructor(
    private publicFilesService: PublicFilesService,
    private requestParser: RequestsParserService
  ) {}

  @Post("user")
  @UseGuards(JwtAuthenticationGuard)
  @ImagesUploadEndpoint([{ name: "avatar", maxCount: 1 }], {
    limits: { fileSize: 10 * MEGABYTE_IN_BYTES }
  })
  async uploadAvatar(@UploadedFiles() files: { avatar?: MulterFile[] }, @Req() request: Request) {
    console.log(files)
    const userId = this.requestParser.parseUserIdOrFail(request)

    const avatar = this.parseSingleFileFromArrayOrUndefined(files.avatar ?? [])
    const isAvatarUploaded = avatar !== undefined

    if (isAvatarUploaded) {
      await this.publicFilesService.uploadAvatar({ userId, file: avatar })
    }

    return {
      uploaded: {
        avatar: isAvatarUploaded
      }
    }
  }

  @Get("user/:userId/:fileType")
  async downloadFile(
    @Param() { userId, fileType }: { userId: string; fileType: PublicFileType },
    @Res() response: Response
  ) {
    const file = await this.publicFilesService.findOneByUserIdAndFileType(userId, fileType)

    return this.sendFile(file, response)
  }

  private async sendFile(publicFile: PublicFile, response: Response) {
    response.setHeader("Content-Type", publicFile.mimetype)
    return response.send(publicFile.content)
  }

  private parseSingleFileFromArrayOrUndefined(
    arrayWithSingleFile: MulterFile[]
  ): MulterFile | undefined {
    return arrayWithSingleFile?.at(0)
  }
}
