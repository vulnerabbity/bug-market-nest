import { Args, Query, Resolver } from "@nestjs/graphql"
import { SearchManyQuery, SearchSingleQuery } from "./geonames/geonames.interface"
import { City, Country, PaginatedCities, PaginatedCountries } from "./locations.objects"
import { LocationsService } from "./locations.service"
@Resolver()
export class LocationsResolver {
  constructor(private locationsService: LocationsService) {}

  @Query(() => City, { name: "city" })
  async resolveSingleCity(@Args("query") query: SearchSingleQuery): Promise<City> {
    return await this.locationsService.findCityOrFail(query)
  }

  @Query(() => Country, { name: "country" })
  async resolveSingleCountry(@Args("query") query: SearchSingleQuery): Promise<Country> {
    return await this.locationsService.findCountryOrFail(query)
  }

  @Query(() => PaginatedCities, { name: "cities" })
  async resolveManyCities(@Args("query") query: SearchManyQuery): Promise<PaginatedCities> {
    return await this.locationsService.findManyCities(query)
  }

  @Query(() => PaginatedCountries, { name: "countries" })
  async resolveManyCountries(@Args("query") query: SearchManyQuery) {
    return await this.locationsService.findManyCountries(query)
  }
}
