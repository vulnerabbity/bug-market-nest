import { Field, InputType } from "@nestjs/graphql"
import { Iso3166CountriesCodesEnum, Iso3166CountryCode } from "../interfaces/iso-3166.interface"

@InputType()
export class CityInput {
  @Field(() => Iso3166CountriesCodesEnum)
  countryIsoCode!: Iso3166CountryCode
}
