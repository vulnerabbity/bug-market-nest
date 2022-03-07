import { Document, Model, FilterQuery } from "mongoose"
import { MongooseService } from "src/common/service/mongoose.service"
import { BaseFile } from "./base-file.entity"

export abstract class BaseFileService<T extends BaseFile> extends MongooseService<T> {
  constructor(private fileModel: Model<T & Document>) {
    super(fileModel)
  }

  public async upload(dto: Partial<T>): Promise<void> {
    const isFileExists = await this.isExists({ url: dto.url })

    if (!isFileExists) {
      await this.createOrFail(dto)
      return
    }

    const update: Partial<T> = {
      data: dto.data,
      mimetype: dto.mimetype
    } as Partial<T>
    await this.updateOrFail({ url: dto.url }, update)
  }

  public async findByUrl(url: string) {
    return await this.findOneOrFail({ url })
  }

  public async getUserId(filter: FilterQuery<T>) {
    return await this.findOneOrFail(filter, { userId: true })
  }

  public async deleteByUrl(url: string) {
    await this.deleteOneOrFail({ url })
  }
}
