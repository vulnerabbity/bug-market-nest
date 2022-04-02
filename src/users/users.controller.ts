import { Controller, Param, Post, Req, UploadedFile, UseGuards } from "@nestjs/common"
import { Request } from "express"
import { JwtAuthenticationGuard } from "src/auth/authentication/guards/jwt-authentication.guard"
import { ImageUploadEndpoint } from "src/files/decorators/image-upload-endpoint.decorator"
import { MEGABYTE_IN_BYTES } from "src/files/files.constants"
import { MulterFile } from "src/files/multer/interface.multer"
import { PublicFileResponse } from "src/files/public/public-files.interface"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import { v4 as uuidV4 } from "uuid"
import { UploadAvatarDto } from "./user.interface"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService, private requestsParser: RequestsParserService) {}

  @Post(":userId/avatar")
  @UseGuards(JwtAuthenticationGuard)
  @ImageUploadEndpoint("avatar", { limits: { fileSize: MEGABYTE_IN_BYTES } })
  public async createAvatar(
    @UploadedFile() uploadedAvatar: MulterFile,
    @Param("userId") userId: string,
    @Req() request: Request
  ): Promise<PublicFileResponse> {
    const requester = this.requestsParser.parseRolesOwnerOrFail(request)
    const userToUpdate = await this.usersService.findByIdOrFail(userId)

    this.usersService.failIfUpdatingForbidden({ subject: userToUpdate, requester })
    const newId = `${userToUpdate.id}_avatar`
    console.log("post avatar")

    const avatarDto: UploadAvatarDto = {
      data: uploadedAvatar.buffer,
      mimetype: uploadedAvatar.mimetype,
      userId: requester.id,
      id: newId
    }

    await this.usersService.uploadAvatar(avatarDto)
    return { success: true, message: "Avatar uploaded", imageId: newId }
  }
}
