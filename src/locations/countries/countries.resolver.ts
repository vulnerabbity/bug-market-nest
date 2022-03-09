import { Args, Query, Resolver } from "@nestjs/graphql"
import { PaginationArgs } from "src/common/args/pagination.args"
import { Country, PaginatedCountries } from "./country.objects"
import { CountriesService } from "./countries.service"

@Resolver(() => Country)
export class CountriesResolver {
  constructor(private countriesService: CountriesService) {}

  @Query(() => PaginatedCountries, { name: "countries" })
  async findPaginatedCountries(
    @Args("languageCode") languageCode: string,
    @Args() pagination: PaginationArgs
  ): Promise<PaginatedCountries> {
    const paginated = await this.countriesService.findManyPaginated(languageCode, pagination)
    return paginated
  }
}
