import { Inject, Injectable } from "@nestjs/common"
import { User, UserFilterQuery, UserModel } from "src/users/user.entity"
import { InjectModel } from "@nestjs/mongoose"
import { UploadAvatarDto } from "./user.interface"
import { PublicFilesService } from "src/files/public/public-files.service"
import { PublicFileDto } from "src/files/public/dto/public-file.dto"
import { MongooseCaslService } from "src/common/service/mongoose-casl.service"

@Injectable()
export class UsersService extends MongooseCaslService<User> {
  @Inject()
  private publicFilesService!: PublicFilesService

  constructor(
    @InjectModel(User.name)
    private userModel: UserModel
  ) {
    super(userModel)
  }

  public async findByUsernameOrFail(username: string): Promise<User> {
    return await this.findOneOrFail({ username })
  }

  public async changePasswordOrFail(filter: UserFilterQuery, newPassword: string): Promise<void> {
    await this.updateOrFail(filter, { password: newPassword })
  }

  public async uploadAvatar(uploadAvatarData: UploadAvatarDto): Promise<User> {
    const avatarUrl = this.generateAvatarUrl(uploadAvatarData.userId)
    const uploadAvatarFileDto: PublicFileDto = {
      ...uploadAvatarData,
      url: avatarUrl
    }
    await this.publicFilesService.upload(uploadAvatarFileDto)
    return await this.updateAvatarUrl(avatarUrl, uploadAvatarData.userId)
  }

  private generateAvatarUrl(userId: string): string {
    return `${userId}_avatar`
  }

  private async updateAvatarUrl(newUrl: string, userId: string): Promise<User> {
    return await this.updateByIdOrFail(userId, { avatarUrl: newUrl })
  }
}
