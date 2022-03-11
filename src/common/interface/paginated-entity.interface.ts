export abstract class IPaginatedEntities<T> {
  data!: T[]
  totalResultsCount!: number
}
