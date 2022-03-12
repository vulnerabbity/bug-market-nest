import { registerEnumType } from "@nestjs/graphql"
import { FilterQuery, ProjectionFields } from "mongoose"
import { PaginationSettings } from "../service/mongoose.service"

export class MongooseBasicSearchingQuery<T> {
  sorting?: unknown
  /**
   * This property allows to manage what fields of document you want retrieve
   */
  pagination?: PaginationSettings
}

export class MongooseFilteredSearchingQuery<T> extends MongooseBasicSearchingQuery<T> {
  filter?: FilterQuery<T>
}

export enum MongooseSortingOrdersEnum {
  ASCENDING = "ascending",
  DESCENDING = "descending"
}

registerEnumType(MongooseSortingOrdersEnum, { name: "SortingOrder" })

// convert to union type
export type MongooseSortingOrder = `${MongooseSortingOrdersEnum}`
