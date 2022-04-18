import { BadRequestException, NotFoundException } from "@nestjs/common"
import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from "mongoose"
import { MongooseFilteredSearchingQuery } from "../interface/mongoose.interface"
import { IPaginatedEntities } from "../interface/paginated-entity.interface"

/**
 * Allows to extend mongoose model methods by remapping it into class and then use inheritance.
 * Now it remaps not all common methods of model. If you need one - feel free to add it here.
 * Although changes default mongoose not found behavior from "returning null"
 * to "throwing exceptions" to provide more clean client code
 */
export abstract class MongooseModelToServiceAdapter<T> {
  constructor(protected documentModel: Model<T & Document>) {}

  /**Scan entire collection to get count. Slow for big collections */
  public async getTotalCount(
    filter?: FilterQuery<T & Document>,
    options?: QueryOptions
  ): Promise<number> {
    filter = filter ?? {}
    return await this.documentModel.countDocuments(filter, options)
  }

  /**Get estimated documents count using collection metadata. Fast for big collections */
  public async getEstimatedCount(filter?: FilterQuery<T & Document>): Promise<number> {
    filter = filter ?? {}
    return await this.documentModel.estimatedDocumentCount(filter)
  }

  public async findByIdOrFail(id: string, projection?: any): Promise<T> {
    return await this.findOneOrFail({ id }, projection)
  }

  public async findOneOrFail(filter: FilterQuery<T & Document>, projection?: any): Promise<T> {
    filter = filter ?? {}
    const document = await this.documentModel.findOne(filter, projection)

    if (document === null) {
      throw new NotFoundException(`${this.documentModel.modelName} not found`)
    }

    return document
  }

  public async findMany(searchingQuery: MongooseFilteredSearchingQuery<T> = {}): Promise<T[]> {
    return await this.makeFindManyQuery(searchingQuery).exec()
  }

  public async findManyPaginated(
    query: MongooseFilteredSearchingQuery<T> = {}
  ): Promise<IPaginatedEntities<T>> {
    const documents = await this.findMany(query)
    const resultsNumber = await this.documentModel.countDocuments(query.filter ?? {})
    return { data: documents, totalResultsCount: resultsNumber }
  }

  public async createOrFail(dto: Partial<T>): Promise<T> {
    return await this.documentModel.create(dto)
  }

  public async updateByIdOrFail(id: string, update: Partial<T>, projection?: any): Promise<T> {
    await this.documentModel.findOneAndUpdate({ id }, update)

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

  public async updateMany(
    filter?: FilterQuery<T & Document>,
    update?: UpdateQuery<T & Document>,
    projection?: any
  ) {
    const documentsWithId: { id: string }[] = await this.documentModel.find(filter ?? {}, {
      id: true
    })
    // get ids because after update filter may be not relevant
    const documentsIds = documentsWithId.map(document => document.id)

    await this.documentModel.updateMany(filter, update)

    return await this.documentModel.find({ id: { $in: documentsIds } }, projection)
  }

  public async deleteOneOrFail(filter: FilterQuery<T & Document>): Promise<void> {
    await this.findOneOrFail(filter)
    await this.documentModel.deleteOne(filter)
  }

  public async deleteByIdOrFail(id: string): Promise<void> {
    await this.deleteOneOrFail({ id: id })
  }

  public async deleteManyOrFail(filter: FilterQuery<T & Document>): Promise<void> {
    const { deletedCount } = await this.documentModel.deleteMany(filter)
    if (deletedCount === 0) {
      throw new BadRequestException("Nothing was deleted")
    }
  }

  protected makeFindManyQuery(searchingQuery: MongooseFilteredSearchingQuery<T> = {}) {
    searchingQuery.filter = searchingQuery.filter ?? {}
    searchingQuery.pagination = searchingQuery.pagination ?? { limit: 50, offset: 0 }
    const { filter, pagination, sorting } = searchingQuery
    const query = this.documentModel
      .find(filter)
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort(sorting)
    return query
  }
}
