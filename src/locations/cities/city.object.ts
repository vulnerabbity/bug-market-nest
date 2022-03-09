import { Field, ObjectType, registerEnumType } from "@nestjs/graphql"
import { IPaginatedEntities } from "src/common/interface/paginated-entity.interface"
import { Iso3166CountriesCodesEnum, Iso3166CountryCode } from "../interfaces/iso-3166.interface"

registerEnumType(Iso3166CountriesCodesEnum, { name: "countryCode" })

@ObjectType()
export class City {
  @Field()
  id!: number

  @Field(() => Iso3166CountriesCodesEnum)
  countryCode!: Iso3166CountryCode

  @Field()
  translatedName!: string

  @Field()
  toponymName!: string
}

@ObjectType()
export class PaginatedCities implements IPaginatedEntities<City> {
  @Field(() => [City])
  data!: City[]

  @Field()
  totalResultsCount!: number
}
