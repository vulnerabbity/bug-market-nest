import { Document, Model, FilterQuery } from "mongoose"
import { MongooseService } from "src/common/service/mongoose.service"
import { BaseFile } from "./base-file.entity"

export abstract class BaseFileService<T extends BaseFile> extends MongooseService<T> {
  constructor(private fileModel: Model<T & Document>) {
    super(fileModel)
  }

  public async upload(
    dto: Omit<T, "createdAt" | "updatedAt" | "url">
  ): Promise<{ newId: string; oldId: string | null }> {
    const oldId = dto.id
    const isFileExists = await this.isExists({ id: oldId })

    if (!isFileExists) {
      const { id: newId } = await this.createOrFail(dto as Partial<T>)
      return { newId, oldId: null }
    }

    const update: Partial<T> = {
      data: dto.data,
      mimetype: dto.mimetype
    } as Partial<T>
    const { id: newId } = await this.updateOrFail({ id: dto.id }, update)
    return { newId, oldId }
  }

  public async getUserId(filter: FilterQuery<T>) {
    return await this.findOneOrFail(filter, { userId: true })
  }

  public async getUpdatedAt(id: string): Promise<Date> {
    const { updatedAt } = await this.findByIdOrFail(id, {
      updatedAt: true
    })
    return updatedAt
  }
}
