import { ParseIntPipe } from "@nestjs/common"
import { Args, Query, registerEnumType, Resolver } from "@nestjs/graphql"
import { PaginationArgs } from "src/common/args/pagination.args"
import { Iso3166CountriesCodesEnum } from "../interfaces/iso-3166.interface"
import { CityInput } from "./cities.input"
import { CitiesService } from "./cities.service"
import { City, PaginatedCities } from "./city.object"

registerEnumType(Iso3166CountriesCodesEnum, { name: "country" })

@Resolver(() => City)
export class CitiesResolver {
  constructor(private citiesService: CitiesService) {}

  @Query(() => PaginatedCities, { name: "cities" })
  async findPaginatedCities(
    @Args("languageCode") language: string,
    @Args("conditions") { countryIsoCode: country }: CityInput,
    @Args() pagination: PaginationArgs
  ) {
    return await this.citiesService.findManyPaginated({ country, language }, pagination)
  }

  @Query(() => City, { name: "city" })
  async findCityById(
    @Args("languageCode") language: string,
    @Args("id", ParseIntPipe) cityId: number
  ) {
    return await this.citiesService.findById({ id: cityId, language })
  }
}
