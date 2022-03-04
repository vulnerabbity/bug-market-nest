import { NotFoundException } from "@nestjs/common"
import { Document, FilterQuery, Model } from "mongoose"
import {
  MongooseModelToServiceAdapter,
  parseObjectIdOrFail
} from "./mongoose-model-to-service-adapter.service"

export interface PaginationSettings {
  offset: number
  limit: number
}

/**
 * Extend this class if you want to use mongoose model in OOP style
 */
export abstract class MongooseService<T> extends MongooseModelToServiceAdapter<T> {
  constructor(documentModel: Model<T & Document>) {
    super(documentModel)
  }

  public async isExists(filter: FilterQuery<T & Document>): Promise<boolean> {
    // Optimization to retrieve only id instead of full document
    const pickIdOnly = { _id: true }
    const entityIdOrNull = await this.documentModel.findOne(filter, pickIdOnly)

    if (entityIdOrNull === null) {
      return false
    }

    return true
  }

  public async failIfNotExists(filter: FilterQuery<T & Document>): Promise<void> {
    const isDocumentExists = await this.isExists(filter)
    if (isDocumentExists === false) {
      throw new NotFoundException(`${this.documentModel.modelName} not found`)
    }
  }

  public async failIfIdNotExists(id: string): Promise<void> {
    const documentId = parseObjectIdOrFail(id)
    return await this.failIfNotExists({ _id: documentId })
  }
}
