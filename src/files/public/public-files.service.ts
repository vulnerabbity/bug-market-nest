import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { MongooseService } from "src/common/service/mongoose.service"
import { MulterFile } from "../multer/interface.multer"
import {
  PublicFile,
  PublicFileModel,
  PublicFileType,
  PublicFileTypesEnum
} from "./public-file.entity"

interface FileInput {
  userId: string
  file: MulterFile
}

@Injectable()
export class PublicFilesService extends MongooseService<PublicFile> {
  constructor(@InjectModel(PublicFile.name) private publicFileModel: PublicFileModel) {
    super(publicFileModel)
  }

  public async uploadAvatar({ userId, file }: FileInput) {
    const isAvatarExists = await this.isAvatarExists({ userId })

    const avatarData = { userId, file }

    if (isAvatarExists) {
      return await this.updatePublicFile(avatarData, "avatar")
    }

    return await this.createPublicFile(avatarData, "avatar")
  }

  public async isAvatarExists(filter: Partial<PublicFile>): Promise<Boolean> {
    return await this.isExists({ ...filter, fileType: PublicFileTypesEnum.AVATAR })
  }

  private async createPublicFile(
    { userId, file }: FileInput,
    fileType: PublicFileType
  ): Promise<PublicFile> {
    // TODO: Add compression
    return await this.createOrFail({
      userId,
      fileType,
      content: file.buffer,
      mimetype: file.mimetype
    })
  }

  private async updatePublicFile(
    { userId, file }: FileInput,
    fileType: PublicFileType
  ): Promise<PublicFile> {
    // TODO: Add compression
    return await this.updateOrFail(
      { userId, fileType },
      { content: file.buffer, mimetype: file.mimetype }
    )
  }

  public async findOneByUserIdAndFileType(
    userId: string,
    fileType: PublicFileType
  ): Promise<PublicFile> {
    return await this.findOneOrFail({ userId, fileType })
  }
}
