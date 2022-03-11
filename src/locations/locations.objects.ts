import { Field, InputType, ObjectType, OmitType } from "@nestjs/graphql"
import { IPaginatedEntities } from "src/common/interface/paginated-entity.interface"

@ObjectType({ isAbstract: true })
export class LocationEntity {
  @Field()
  id!: number

  @Field()
  countryCode!: string

  @Field()
  name!: string

  @Field()
  translatedName!: string
}

export class PaginatedLocationEntities implements IPaginatedEntities<LocationEntity> {
  data!: LocationEntity[]
  totalResultsCount!: number
}

@ObjectType()
export class City extends OmitType(LocationEntity, []) {}

@ObjectType()
export class Country extends OmitType(LocationEntity, []) {}

@ObjectType()
export class PaginatedCities extends IPaginatedEntities<City> {
  @Field(() => [City])
  data!: City[]
  @Field()
  totalResultsCount!: number
}

@ObjectType()
export class PaginatedCountries extends IPaginatedEntities<Country> {
  @Field(() => [Country])
  data!: Country[]
  @Field()
  totalResultsCount!: number
}
