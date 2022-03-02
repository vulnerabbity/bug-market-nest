import { Controller, Param, Post, Req, UploadedFile, UseGuards } from "@nestjs/common"
import { Request } from "express"
import { JwtAuthenticationGuard } from "src/auth/authentication/guards/jwt-authentication.guard"
import { RolesOwner } from "src/auth/authorization/abilities/abilities.interface"
import { CaslAbilityFactory } from "src/auth/authorization/abilities/casl-ability.factory"
import { InvalidPermissionsException } from "src/common/exceptions/authorization.exception"
import { ImageUploadEndpoint } from "src/files/decorators/image-upload-endpoint.decorator"
import { MEGABYTE_IN_BYTES } from "src/files/files.constants"
import { MulterFile } from "src/files/multer/interface.multer"
import { PublicFileDto } from "src/files/public/dto/public-file.dto"
import { PublicFilesService } from "src/files/public/public-files.service"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import { User } from "./user.entity"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
  constructor(
    private publicFilesService: PublicFilesService,
    private usersService: UsersService,
    private requestsParser: RequestsParserService,
    private abilityFactory: CaslAbilityFactory
  ) {}

  @Post("avatar/:avatarUrl")
  @UseGuards(JwtAuthenticationGuard)
  @ImageUploadEndpoint("avatar", { limits: { fileSize: MEGABYTE_IN_BYTES } })
  public async uploadAvatar(
    @UploadedFile() uploadedAvatar: MulterFile,
    @Param("avatarUrl") avatarUrl: string,
    @Req() request: Request
  ) {
    const requester = this.requestsParser.parseRolesOwnerOrFail(request)
    const userToUpdate = await this.usersService.findOneOrFail({ avatarUrl })

    await this.canUpdateUserGuard(requester, userToUpdate)

    const avatarDto: PublicFileDto = {
      data: uploadedAvatar.buffer,
      mimetype: uploadedAvatar.mimetype,
      url: avatarUrl,
      userId: requester.id
    }

    return await this.publicFilesService.upload(avatarDto)
  }

  private async canUpdateUserGuard(requester: RolesOwner, userToUpdate: User) {
    userToUpdate = this.usersService.makeCaslCompatibleUser(userToUpdate)

    const requesterAbilities = this.abilityFactory.createForRolesOwner(requester)
    const canUploadAvatar = requesterAbilities.can("update", userToUpdate)

    if (!canUploadAvatar) {
      throw new InvalidPermissionsException()
    }
  }
}
