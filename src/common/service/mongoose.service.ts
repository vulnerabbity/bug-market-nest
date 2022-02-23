import { NotFoundException } from "@nestjs/common"
import { AnyObject, Document, FilterQuery, Model, isValidObjectId, ObjectId } from "mongoose"
import { InvalidObjectIdException } from "../exceptions/mongoose/invalid-object-id.exception"

type EntityFilterQuery<Entity extends AnyObject> = FilterQuery<Entity & Document>

export interface PaginationSettings {
  offset: number
  limit: number
}

/**
 * Base class to provide common crud operations in heir services
 *
 * Methods with "OrFail" postfix throw exception if cant proceed
 */
export abstract class MongooseService<Entity> {
  constructor(private entityModel: Model<Entity & Document>) {}

  /**Scan entire collection to get count. Slow for big collections */
  public async getTotalCount(): Promise<number> {
    return await this.entityModel.countDocuments()
  }

  /**Get estimated documents count using collection metadata. Fast for big collections */
  public async getEstimatedCount(): Promise<number> {
    return await this.entityModel.estimatedDocumentCount()
  }

  public async findByIdOrFail(id: string): Promise<Entity> {
    const entity = await this.findOneOrFail({
      _id: parseObjectIdOrFail(id)
    })

    return entity
  }

  public async findOneOrFail(filter?: EntityFilterQuery<Entity>): Promise<Entity> {
    filter = filter ?? {}
    const entity = await this.entityModel.findOne(filter)

    if (entity === null) {
      throw new NotFoundException(`${this.entityModel.modelName} not found`)
    }

    return entity
  }

  public async findManyPaginated(
    filter: EntityFilterQuery<Entity>,
    paginationSettings: PaginationSettings
  ) {
    const offset = paginationSettings.offset
    const limit = paginationSettings.limit
    return await this.entityModel.find(filter).skip(offset).limit(limit)
  }

  public async findAll(filter?: EntityFilterQuery<Entity>): Promise<Entity[]> {
    filter = filter ?? {}
    return await this.entityModel.find(filter)
  }

  public async createOrFail(dto: Partial<Entity>): Promise<Entity> {
    const createdEntity = await this.entityModel.create(dto)
    return createdEntity
  }

  public async updateByIdOrFail(id: string, dto: Partial<Entity>): Promise<Entity> {
    await this.entityModel.findByIdAndUpdate(id, dto)

    const updatedEntity = await this.findByIdOrFail(id)

    return updatedEntity
  }
}

function parseObjectIdOrFail(id: string): ObjectId {
  if (!isValidObjectId(id)) {
    throw new InvalidObjectIdException()
  }

  return id as unknown as ObjectId
}
