import { Field, ObjectType } from "@nestjs/graphql"
import { IPaginatedEntities } from "src/common/interface/paginated-entity.interface"

@ObjectType()
export class Country {
  @Field()
  id!: number

  @Field()
  isoCode!: string

  @Field()
  translatedName!: string

  @Field()
  toponymName!: string
}

@ObjectType()
export class PaginatedCountries implements IPaginatedEntities<Country> {
  @Field(() => [Country])
  data!: Country[]

  @Field()
  totalResultsCount!: number
}
