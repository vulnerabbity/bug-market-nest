import { NotFoundException } from "@nestjs/common"
import { Model, Document, isValidObjectId, ObjectId, FilterQuery } from "mongoose"
import { InvalidObjectIdException } from "../exceptions/mongoose/invalid-object-id.exception"
import { PaginationSettings } from "./mongoose.service"

/**
 * Allows to extend mongoose model methods by remapping it into class and then use inheritance.
 * Now it remaps not all common methods of model. If you need one - feel free to add it here.
 * Although changes default mongoose not found behavior from "returning null"
 * to "throwing exceptions" to provide more clean client code
 */
export abstract class MongooseModelToServiceAdapter<T> {
  constructor(protected documentModel: Model<T & Document>) {}

  /**Scan entire collection to get count. Slow for big collections */
  public async getTotalCount(): Promise<number> {
    return await this.documentModel.countDocuments()
  }

  /**Get estimated documents count using collection metadata. Fast for big collections */
  public async getEstimatedCount(): Promise<number> {
    return await this.documentModel.estimatedDocumentCount()
  }

  public async findByIdOrFail(id: string, projection?: any): Promise<T> {
    const parsedId = parseObjectIdOrFail(id)
    return await this.findOneOrFail({ _id: parsedId }, projection)
  }

  public async findOneOrFail(filter?: FilterQuery<T & Document>, projection?: any): Promise<T> {
    filter = filter ?? {}
    const document = await this.documentModel.findOne(filter, projection)

    if (document === null) {
      throw new NotFoundException(`${this.documentModel.modelName} not found`)
    }

    return document
  }

  public async findMany(filter: FilterQuery<T & Document>, projection?: any) {
    return this.documentModel.find(filter, projection)
  }

  public async findManyPaginated(
    filter: FilterQuery<T & Document>,
    paginationSettings: PaginationSettings,
    projection?: any
  ) {
    const offset = paginationSettings.offset
    const limit = paginationSettings.limit
    return await this.documentModel.find(filter, projection).skip(offset).limit(limit)
  }

  public async findAll(filter?: FilterQuery<T>, projection?: any): Promise<T[]> {
    filter = filter ?? {}
    return await this.documentModel.find(filter)
  }

  public async createOrFail(dto: Partial<T>): Promise<T> {
    return await this.documentModel.create(dto)
  }

  public async updateByIdOrFail(id: string, update: Partial<T>, projection?: any): Promise<T> {
    await this.documentModel.findByIdAndUpdate(id, update)

    const updatedDocument = await this.findByIdOrFail(id, projection)

    return updatedDocument
  }

  public async updateOrFail(
    filter: FilterQuery<T & Document>,
    update: Partial<T>,
    projection?: any
  ): Promise<T> {
    await this.documentModel.updateOne(filter, update)

    const updatedDocument = await this.findOneOrFail(filter, projection)
    return updatedDocument
  }
}

function parseObjectIdOrFail(id: string): ObjectId {
  if (!isValidObjectId(id)) {
    throw new InvalidObjectIdException()
  }

  return id as unknown as ObjectId
}
