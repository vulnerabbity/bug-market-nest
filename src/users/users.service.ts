import { Inject, Injectable } from "@nestjs/common"
import { User, UserFilterQuery } from "src/users/user.entity"
import { UploadAvatarDto } from "./user.interface"
import { PublicFilesService } from "src/files/public/public-files.service"
import { MongooseCaslService } from "src/common/service/mongoose-casl.service"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"

@Injectable()
export class UsersService extends MongooseCaslService<User> {
  @Inject()
  private publicFilesService!: PublicFilesService

  constructor(private modelsInjector: ModelsInjectorService) {
    super(modelsInjector.userModel)
  }

  public async findByUsernameOrFail(username: string): Promise<User> {
    return await this.findOneOrFail({ username })
  }

  public async changePasswordOrFail(filter: UserFilterQuery, newPassword: string): Promise<void> {
    await this.updateOrFail(filter, { password: newPassword })
  }

  public async uploadAvatar(uploadAvatarData: UploadAvatarDto): Promise<User> {
    await this.publicFilesService.upload(uploadAvatarData)
    return await this.updateAvatarId(uploadAvatarData.id, uploadAvatarData.userId)
  }

  public async deleteAvatar({
    userId,
    avatarId
  }: {
    userId: string
    avatarId: string
  }): Promise<void> {
    await this.publicFilesService.deleteByIdOrFail(avatarId)
    await this.deleteAvatarId(userId)
  }

  private async updateAvatarId(newId: string, userId: string): Promise<User> {
    return await this.updateByIdOrFail(userId, { avatarId: newId })
  }

  private async deleteAvatarId(userId: string): Promise<void> {
    await this.updateByIdOrFail(userId, { avatarId: undefined })
  }
}
